import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import Order from '../models/Order';
import Product from '../models/Product';
import { computeTotals } from '../utils/pricing';
import Promotion from '../models/Promotion';
import GiftCard from '../models/GiftCard';
import { sendOrderPaidEmail } from '../utils/mailer';
import logger from '../config/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, currency, successUrl, cancelUrl, collectShipping, shippingCountry, promoCode, giftCardCode, contact } = req.body as {
      items: Array<{ productId: string; quantity: number; variantIndex?: number | null }>;
      currency?: string;
      successUrl: string;
      cancelUrl: string;
      collectShipping?: boolean;
      shippingCountry?: string;
      promoCode?: string;
      giftCardCode?: string;
      contact?: { 
        email?: string; 
        name?: string; 
        phone?: string; 
        address?: { 
          line1: string; 
          line2?: string; 
          city: string; 
          state?: string; 
          postal_code: string; 
          country: string; 
        };
      };
    };

    if (!process.env.STRIPE_SECRET_KEY) { res.status(500).json({ message: 'Stripe is not configured' }); return; }

    // Load product details
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, active: true });
    const idToProduct = new Map(products.map(p => [p._id.toString(), p]));

    // Build order draft and validate stock
    const orderItems = items.map(i => {
      const p = idToProduct.get(i.productId);
      if (!p) throw new Error('Product not found');
      // Variant-aware price/stock
      let unitPrice = p.priceCents;
      let variantLabel: string | undefined;
      if (typeof i.variantIndex === 'number' && p.variants && p.variants[i.variantIndex]) {
        const v = p.variants[i.variantIndex] as any;
        unitPrice = v.priceCents ?? unitPrice;
        variantLabel = `${v.name}: ${v.value}`;
        const vStock = typeof v.inventoryCount === 'number' ? v.inventoryCount : p.inventoryCount;
        if (vStock < i.quantity) throw new Error(`Insufficient stock for ${p.title} (${variantLabel})`);
      } else {
        if (p.inventoryCount < i.quantity) throw new Error(`Insufficient stock for ${p.title}`);
      }
      return {
        productId: p._id,
        title: p.title,
        priceCents: unitPrice,
        quantity: i.quantity,
        sku: p.sku,
        variant: variantLabel
      };
    });

    let discountCents = 0;
    let giftCardAppliedCents = 0;
    if (promoCode) {
      const promo = await Promotion.findOne({ code: String(promoCode).toUpperCase(), active: true });
      if (promo) {
        const rawSubtotal = orderItems.reduce((s, it) => s + it.priceCents * it.quantity, 0);
        if (!promo.minimumSubtotalCents || rawSubtotal >= promo.minimumSubtotalCents) {
          discountCents = promo.type === 'fixed' ? Math.round(promo.value) : Math.round((rawSubtotal * promo.value) / 100);
        }
      }
    }
    // Gift card
    if (giftCardCode) {
      const gc = await GiftCard.findOne({ code: String(giftCardCode).toUpperCase() });
      if (gc && gc.status === 'active' && (!gc.expiresAt || gc.expiresAt > new Date()) && gc.balanceCents > 0) {
        giftCardAppliedCents = Math.min(gc.balanceCents, orderItems.reduce((s, it) => s + it.priceCents * it.quantity, 0));
      }
    }

    const totals = computeTotals(orderItems.map(i => ({ priceCents: i.priceCents, quantity: i.quantity })), shippingCountry, discountCents + giftCardAppliedCents);
    const order = await Order.create({
      items: orderItems,
      currency: currency || 'EUR',
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      status: 'pending',
      giftCardCode: giftCardCode ? String(giftCardCode).toUpperCase() : undefined,
      giftCardAppliedCents: giftCardAppliedCents,
      contactEmail: contact?.email,
      contactName: contact?.name,
      shippingAddress: contact?.address ? {
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone,
        line1: contact.address.line1,
        line2: contact.address.line2,
        city: contact.address.city,
        state: contact.address.state,
        postalCode: contact.address.postal_code,
        country: contact.address.country
      } : undefined
    });

    // Build Stripe line items
    const lineItems = order.items.map(it => ({
      quantity: it.quantity,
      price_data: {
        currency: order.currency,
        unit_amount: it.priceCents,
        product_data: { name: it.title }
      }
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl + `?orderId=${order._id}`,
      cancel_url: cancelUrl + `?orderId=${order._id}`,
      shipping_address_collection: collectShipping ? { allowed_countries: ['DE', 'FR', 'IT', 'ES', 'IE', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'AT', 'CH', 'LU', 'PT', 'GR', 'PL', 'CZ', 'HR', 'GB'] } : undefined,
      // Add shipping and tax as separate line items for transparency
      invoice_creation: { enabled: false },
      allow_promotion_codes: true,
      metadata: { orderId: order._id.toString() }
    });

    order.stripeCheckoutSessionId = session.id;
    await order.save();

    res.status(201).json({ url: session.url, id: session.id });
  } catch (error: any) {
    logger.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

export const handleStripeWebhook: express.RequestHandler = async (req: Request, res: Response, next: express.NextFunction): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !webhookSecret || !process.env.STRIPE_SECRET_KEY) { res.status(400).send('Webhook configuration error'); return; }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent((req as any).rawBody, sig as string, webhookSecret);
    } catch (err: any) { logger.warn('Stripe webhook signature verification failed', err); res.status(400).send(`Webhook Error: ${err.message}`); return; }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          const order = await Order.findById(orderId);
          if (order) {
            // Update order with payment and shipping info
            const updates: any = {
              status: 'paid',
              stripePaymentIntentId: session.payment_intent as string || undefined
            };
            
            // Save shipping address if provided
            if (session.shipping_details?.address) {
              const addr = session.shipping_details.address;
              updates.shippingAddress = {
                name: session.shipping_details.name || session.customer_details?.name || '',
                line1: addr.line1 || '',
                line2: addr.line2 || '',
                city: addr.city || '',
                state: addr.state || '',
                postalCode: addr.postal_code || '',
                country: addr.country || '',
                email: session.customer_details?.email || ''
              };
            }
            
            await Order.findByIdAndUpdate(orderId, updates);
            
            // Decrement inventory with variant awareness
            for (const item of order.items) {
              const product = await Product.findById(item.productId);
              if (!product) continue;
              // If variant label exists, try to match and decrement variant stock if tracked
              if (item.variant && Array.isArray((product as any).variants)) {
                const idx = (product as any).variants.findIndex((v: any) => `${v.name}: ${v.value}` === item.variant);
                if (idx >= 0 && typeof (product as any).variants[idx].inventoryCount === 'number') {
                  (product as any).variants[idx].inventoryCount = Math.max(0, ((product as any).variants[idx].inventoryCount as number) - item.quantity);
                } else {
                  product.inventoryCount = Math.max(0, product.inventoryCount - item.quantity);
                }
                await product.save();
              } else {
                await Product.findByIdAndUpdate(item.productId, { $inc: { inventoryCount: -item.quantity } });
              }
            }

            // Deduct gift card balance if used
            if (order.giftCardCode && order.giftCardAppliedCents && order.giftCardAppliedCents > 0) {
              await GiftCard.findOneAndUpdate({ code: order.giftCardCode }, { $inc: { balanceCents: -order.giftCardAppliedCents } });
            }

            // Send confirmation email
            try { await sendOrderPaidEmail({ ...(order.toObject() as any), status: 'paid' }); } catch {}
          }
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;
        if (paymentIntentId) {
          await Order.findOneAndUpdate({ stripePaymentIntentId: paymentIntentId }, { status: 'refunded' });
        }
        break;
      }
      default:
        logger.info(`Unhandled Stripe event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    logger.error('Stripe webhook handler error:', error);
    res.status(500).json({ message: 'Webhook handling error' });
  }
};


