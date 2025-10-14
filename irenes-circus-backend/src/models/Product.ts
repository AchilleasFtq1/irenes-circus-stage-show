import mongoose from 'mongoose';

export interface IProductImage {
  url: string;
  alt?: string;
}

export interface IProductVariant {
  name: string; // e.g. Size, Color
  value: string; // e.g. M, Red
  priceCents?: number; // optional variant override price
  sku?: string; // optional variant-specific SKU
  inventoryCount?: number; // optional variant-specific stock
  imageUrl?: string; // optional variant image
}

export interface IProduct {
  _id: string;
  title: string;
  description?: string;
  priceCents: number; // store in smallest currency unit
  currency: string; // ISO currency code, e.g. USD, EUR
  images: IProductImage[];
  sku?: string;
  slug: string;
  inventoryCount: number;
  active: boolean;
  variants?: IProductVariant[];
  category?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productImageSchema = new mongoose.Schema<IProductImage>({
  url: { type: String, required: true, trim: true },
  alt: { type: String, trim: true }
}, { _id: false });

const productVariantSchema = new mongoose.Schema<IProductVariant>({
  name: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true },
  priceCents: { type: Number, min: 0 },
  sku: { type: String, trim: true },
  inventoryCount: { type: Number, min: 0 },
  imageUrl: { type: String, trim: true }
}, { _id: false });

const productSchema = new mongoose.Schema<IProduct>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  priceCents: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, trim: true, default: 'EUR' },
  images: { type: [productImageSchema], default: [] },
  sku: { type: String, trim: true, unique: false },
  slug: { type: String, required: true, trim: true, unique: true },
  inventoryCount: { type: Number, required: true, min: 0, default: 0 },
  active: { type: Boolean, default: true },
  variants: { type: [productVariantSchema], default: [] },
  category: { type: String, trim: true },
  stripeProductId: { type: String, trim: true },
  stripePriceId: { type: String, trim: true }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', sku: 'text' });
productSchema.index({ category: 1 });

export default mongoose.model<IProduct>('Product', productSchema);


