import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import Order from '../models/Order';
import Product from '../models/Product';
import logger from '../config/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, currency, successUrl, cancelUrl, collectShipping } = req.body as {
      items: Array<{ productId: string; quantity: number }>;
      currency?: string;
      successUrl: string;
      cancelUrl: string;
      collectShipping?: boolean;
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
      if (p.inventoryCount < i.quantity) {
        throw new Error(`Insufficient stock for ${p.title}`);
      }
      return {
        productId: p._id,
        title: p.title,
        priceCents: p.priceCents,
        quantity: i.quantity,
        sku: p.sku
      };
    });

    const subtotalCents = orderItems.reduce((sum, it) => sum + it.priceCents * it.quantity, 0);
    const order = await Order.create({
      items: orderItems,
      currency: currency || 'EUR',
      subtotalCents,
      totalCents: subtotalCents,
      status: 'pending'
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
            
            // Decrement inventory
            for (const item of order.items) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { inventoryCount: -item.quantity }
              });
            }
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


