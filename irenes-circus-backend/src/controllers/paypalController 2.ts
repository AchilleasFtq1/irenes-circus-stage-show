import { Client, OrdersController, Environment, CheckoutPaymentIntent, ShippingPreference } from '@paypal/paypal-server-sdk';
import { Request, Response } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
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
    const { items, currency, returnUrl, cancelUrl, collectShipping } = req.body as {
      items: Array<{ productId: string; quantity: number }>;
      currency?: string;
      returnUrl: string;
      cancelUrl: string;
      collectShipping?: boolean;
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

    const client = getPayPalClient();
    const ordersController = new OrdersController(client);
    
    const createOrderRequest = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: order.currency,
              value: (order.totalCents / 100).toFixed(2)
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
      
      // Decrement inventory
      if (order) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { inventoryCount: -item.quantity }
          });
        }
      }
    }

    res.json({ status });
  } catch (error: any) {
    logger.error('Error capturing PayPal order:', error);
    res.status(500).json({ message: 'Failed to capture PayPal order' });
  }
};


