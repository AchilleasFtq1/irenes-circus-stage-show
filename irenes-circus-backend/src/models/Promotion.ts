import mongoose from 'mongoose';

export type PromotionType = 'percent' | 'fixed';

export interface IPromotion {
  _id: string;
  code: string;
  type: PromotionType;
  value: number; // percent (1-100) or cents for fixed
  active: boolean;
  startsAt?: Date;
  endsAt?: Date;
  maxUses?: number;
  uses?: number;
  minimumSubtotalCents?: number;
  applicableProductIds?: mongoose.Types.ObjectId[]; // optional product scoping
  createdAt?: Date;
  updatedAt?: Date;
}

const promotionSchema = new mongoose.Schema<IPromotion>({
  code: { type: String, required: true, trim: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  active: { type: Boolean, default: true },
  startsAt: { type: Date },
  endsAt: { type: Date },
  maxUses: { type: Number, min: 0 },
  uses: { type: Number, default: 0, min: 0 },
  minimumSubtotalCents: { type: Number, min: 0 },
  applicableProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

promotionSchema.index({ code: 1 }, { unique: true });

export default mongoose.model<IPromotion>('Promotion', promotionSchema);


