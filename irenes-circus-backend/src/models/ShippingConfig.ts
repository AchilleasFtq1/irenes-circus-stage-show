import mongoose, { Schema, Document } from 'mongoose';

export interface IShippingOption {
  id: string; // e.g., 'standard', 'express'
  name: string;
  description?: string;
  priceCents: number;
  active?: boolean;
}

export interface IShippingConfig extends Document {
  country: string; // ISO 3166-1 alpha-2
  options: IShippingOption[];
  updatedAt: Date;
  createdAt: Date;
}

const ShippingOptionSchema = new Schema<IShippingOption>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  priceCents: { type: Number, required: true, min: 0 },
  active: { type: Boolean, default: true }
}, { _id: false });

const ShippingConfigSchema = new Schema<IShippingConfig>({
  country: { type: String, required: true, uppercase: true, index: true },
  options: { type: [ShippingOptionSchema], default: [] }
}, { timestamps: true });

ShippingConfigSchema.index({ country: 1 }, { unique: true });

const ShippingConfig = mongoose.model<IShippingConfig>('ShippingConfig', ShippingConfigSchema);
export default ShippingConfig;


