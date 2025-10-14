import { Client, OrdersController, Environment, CheckoutPaymentIntent, ShippingPreference } from '@paypal/paypal-server-sdk';
import { Request, Response } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
import { computeTotals } from '../utils/pricing';
import Promotion from '../models/Promotion';
import GiftCard from '../models/GiftCard';
import logger from '../config/logger';

function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = process.env.PAYPAL_ENV === 'live' ? Environment.Production : Environment.Sandbox;
  
  return new Client({
    environment: environment,
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId || '',
      oAuthClientSecret: clientSecret || ''
    }
  });
}

export const createPayPalOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, currency, returnUrl, cancelUrl, collectShipping, shippingCountry, promoCode, giftCardCode, contact } = req.body as {
      items: Array<{ productId: string; quantity: number; variantIndex?: number | null }>;
      currency?: string;
      returnUrl: string;
      cancelUrl: string;
      collectShipping?: boolean;
      shippingCountry?: string;
      promoCode?: string;
      giftCardCode?: string;
      contact?: { email?: string; name?: string };
    };

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      res.status(500).json({ message: 'PayPal is not configured' });
      return;
    }

    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, active: true });
    const idToProduct = new Map(products.map(p => [p._id.toString(), p]));

    const orderItems = items.map(i => {
      const p = idToProduct.get(i.productId);
      if (!p) throw new Error('Product not found');
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
      contactName: contact?.name
    });

    const client = getPayPalClient();
    const ordersController = new OrdersController(client);
    
    const createOrderRequest = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: order.currency,
              value: (order.totalCents / 100).toFixed(2),
              breakdown: {
                itemTotal: { currencyCode: order.currency, value: (order.subtotalCents / 100).toFixed(2) },
                shipping: { currencyCode: order.currency, value: ((order.shippingCents || 0) / 100).toFixed(2) },
                taxTotal: { currencyCode: order.currency, value: ((order.taxCents || 0) / 100).toFixed(2) }
              }
            }
          }
        ],
        paymentSource: {
          paypal: {
            experienceContext: {
              returnUrl: `${returnUrl}?orderId=${order._id}`,
              cancelUrl: `${cancelUrl}?orderId=${order._id}`,
              shippingPreference: collectShipping ? ShippingPreference.SetProvidedAddress : ShippingPreference.NoShipping
            }
          }
        }
      }
    };

    const response = await ordersController.ordersCreate(createOrderRequest);
    const approveLink = response.result?.links?.find((l: any) => l.rel === 'approve')?.href;

    if (!approveLink) {
      res.status(500).json({ message: 'Failed to create PayPal order' });
      return;
    }

    order.notes = `paypalOrderId:${response.result?.id}`;
    await order.save();

    res.status(201).json({ id: response.result?.id, url: approveLink });
  } catch (error: any) {
    logger.error('Error creating PayPal order:', error);
    res.status(500).json({ message: 'Failed to create PayPal order' });
  }
};

export const capturePayPalOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params; // PayPal order id
    const client = getPayPalClient();
    const ordersController = new OrdersController(client);
    
    const captureOrderRequest = {
      id: orderId
    };
    
    const response = await ordersController.ordersCapture(captureOrderRequest);

    const status = response.result?.status;
    if (status === 'COMPLETED') {
      const paypalOrderId = response.result?.id;
      const order = await Order.findOneAndUpdate(
        { notes: { $regex: `paypalOrderId:${paypalOrderId}` } }, 
        { status: 'paid' },
        { new: true }
      );
      
      // Decrement inventory (variant-aware)
      if (order) {
        for (const item of order.items) {
          const product = await Product.findById(item.productId);
          if (!product) continue;
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
      }
    }

    res.json({ status });
  } catch (error: any) {
    logger.error('Error capturing PayPal order:', error);
    res.status(500).json({ message: 'Failed to capture PayPal order' });
  }
};


