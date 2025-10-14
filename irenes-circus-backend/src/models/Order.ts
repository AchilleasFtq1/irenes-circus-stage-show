import mongoose from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  priceCents: number;
  quantity: number;
  sku?: string;
  variant?: string; // e.g. Size M
}

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded';

export interface IShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string; // ISO country code
  email: string;
}

export interface IOrder {
  _id: string;
  items: IOrderItem[];
  currency: string;
  subtotalCents: number;
  taxCents?: number;
  shippingCents?: number;
  totalCents: number;
  status: OrderStatus;
  shippingAddress?: IShippingAddress;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  notes?: string;
  giftCardCode?: string;
  giftCardAppliedCents?: number;
  trackingNumber?: string;
  contactEmail?: string;
  contactName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  priceCents: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  sku: { type: String, trim: true },
  variant: { type: String, trim: true }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema<IShippingAddress>({
  name: { type: String, required: true, trim: true },
  line1: { type: String, required: true, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true }
}, { _id: false });

const orderSchema = new mongoose.Schema<IOrder>({
  items: { type: [orderItemSchema], required: true },
  currency: { type: String, required: true, default: 'EUR' },
  subtotalCents: { type: Number, required: true, min: 0 },
  taxCents: { type: Number, min: 0 },
  shippingCents: { type: Number, min: 0 },
  totalCents: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'paid', 'fulfilled', 'cancelled', 'refunded'], default: 'pending' },
  shippingAddress: { type: shippingAddressSchema },
  stripePaymentIntentId: { type: String, trim: true },
  stripeCheckoutSessionId: { type: String, trim: true },
  notes: { type: String, trim: true },
  giftCardCode: { type: String, trim: true },
  giftCardAppliedCents: { type: Number, min: 0 },
  trackingNumber: { type: String, trim: true },
  contactEmail: { type: String, trim: true },
  contactName: { type: String, trim: true }
}, { timestamps: true });

orderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IOrder>('Order', orderSchema);


