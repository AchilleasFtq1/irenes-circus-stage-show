import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Order from '../models/Order';
import Product from '../models/Product';
import logger from '../config/logger';
import { sendOrderFulfilledEmail } from '../utils/mailer';

export const listOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    logger.error('Error listing orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404).json({ message: 'Order not found' }); return; }
    res.json(order);
  } catch (error: any) {
    logger.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

export const markFulfilled = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates: any = { status: 'fulfilled' };
    if (req.body.trackingNumber) updates.trackingNumber = req.body.trackingNumber;
    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!order) { res.status(404).json({ message: 'Order not found' }); return; }
  try { await sendOrderFulfilledEmail(order); } catch {}
    res.json(order);
  } catch (error: any) {
    logger.error('Error marking order fulfilled:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

export const createDraftOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { items, currency, shippingAddress } = req.body as {
      items: Array<{ productId: string; quantity: number }>;
      currency: string;
      shippingAddress?: any;
    };

    // Build items details from product records
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const idToProduct = new Map(products.map(p => [p._id.toString(), p]));

    const orderItems = items.map(i => {
      const p = idToProduct.get(i.productId);
      if (!p) throw new Error('Product not found in cart');
      return {
        productId: p._id,
        title: p.title,
        priceCents: p.priceCents,
        quantity: i.quantity,
        sku: p.sku
      };
    });

    const subtotalCents = orderItems.reduce((sum, it) => sum + it.priceCents * it.quantity, 0);
    const totalCents = subtotalCents; // tax/shipping added during checkout if needed

    const order = await Order.create({
      items: orderItems,
      currency: currency || 'EUR',
      subtotalCents,
      totalCents,
      status: 'pending',
      shippingAddress
    });
    res.status(201).json(order);
  } catch (error: any) {
    logger.error('Error creating draft order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};


