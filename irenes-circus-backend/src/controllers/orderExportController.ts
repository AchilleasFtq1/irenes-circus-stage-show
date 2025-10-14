import { Request, Response } from 'express';
import Order from '../models/Order';

function toCsvValue(val: any): string {
  if (val === null || val === undefined) return '';
  const s = String(val).replace(/"/g, '""');
  if (/[",\n]/.test(s)) return `"${s}"`;
  return s;
}

export const exportOrdersCsv = async (req: Request, res: Response): Promise<void> => {
  const { from, to, status, unexported } = req.query as any;
  const filter: any = {};
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (status) filter.status = status;
  if (unexported === 'true') filter.exportedAt = { $exists: false };

  const orders = await Order.find(filter).sort({ createdAt: 1 });
  const headers = [
    'orderId','createdAt','status','currency','subtotal','tax','shipping','total','contactName','contactEmail','tracking','itemSku','itemTitle','itemVariant','itemQty','itemPrice'
  ];
  const rows: string[] = [];
  rows.push(headers.join(','));
  for (const o of orders) {
    for (const it of o.items) {
      rows.push([
        o._id,
        o.createdAt?.toISOString() || '',
        o.status,
        o.currency,
        (o.subtotalCents/100).toFixed(2),
        ((o.taxCents||0)/100).toFixed(2),
        ((o.shippingCents||0)/100).toFixed(2),
        (o.totalCents/100).toFixed(2),
        o.contactName || '',
        o.contactEmail || '',
        o.trackingNumber || '',
        it.sku || '',
        it.title,
        it.variant || '',
        it.quantity,
        (it.priceCents/100).toFixed(2)
      ].map(toCsvValue).join(','));
    }
  }
  const csv = rows.join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
  res.send(csv);
};

export const markExported = async (req: Request, res: Response): Promise<void> => {
  const { from, to } = req.body as any;
  const filter: any = {};
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  const batchId = `exp_${Date.now()}`;
  await Order.updateMany(filter, { $set: { exportedAt: new Date(), exportBatchId: batchId } });
  res.json({ message: 'Marked exported', batchId });
};


