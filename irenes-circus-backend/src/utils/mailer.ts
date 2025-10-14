import nodemailer from 'nodemailer';
import { IOrder } from '../models/Order';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: !!process.env.EMAIL_SECURE && process.env.EMAIL_SECURE !== 'false',
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  } : undefined
});

const FROM = process.env.EMAIL_FROM || 'no-reply@example.com';
const ADMIN = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'admin@example.com';

export async function sendOrderPaidEmail(order: IOrder): Promise<void> {
  const to = order.contactEmail || ADMIN;
  const subject = `Order ${order._id} confirmed`;
  const html = `
    <h2>Thank you for your order</h2>
    <p>Order ID: ${order._id}</p>
    <p>Status: ${order.status}</p>
    <p>Total: ${(order.totalCents/100).toFixed(2)} ${order.currency}</p>
  `;
  await transporter.sendMail({ from: FROM, to, subject, html });
  if (order.contactEmail) {
    await transporter.sendMail({ from: FROM, to: ADMIN, subject: `New order ${order._id}`, html });
  }
}

export async function sendOrderFulfilledEmail(order: IOrder): Promise<void> {
  if (!order.contactEmail) return;
  const subject = `Order ${order._id} shipped`;
  const html = `
    <h2>Your order is on the way</h2>
    <p>Tracking number: ${order.trackingNumber || 'N/A'}</p>
  `;
  await transporter.sendMail({ from: FROM, to: order.contactEmail, subject, html });
}

export async function sendOrderRefundEmail(order: IOrder): Promise<void> {
  if (!order.contactEmail) return;
  const subject = `Order ${order._id} refunded`;
  const html = `<p>Your order has been refunded.</p>`;
  await transporter.sendMail({ from: FROM, to: order.contactEmail, subject, html });
}


