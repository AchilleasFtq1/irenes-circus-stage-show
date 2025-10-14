import mongoose from 'mongoose';

export type GiftCardStatus = 'active' | 'redeemed' | 'disabled' | 'expired';

export interface IGiftCard {
  _id: string;
  code: string; // unique redeem code
  balanceCents: number;
  originalAmountCents: number;
  status: GiftCardStatus;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const giftCardSchema = new mongoose.Schema<IGiftCard>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  balanceCents: { type: Number, required: true, min: 0 },
  originalAmountCents: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['active','redeemed','disabled','expired'], default: 'active' },
  expiresAt: { type: Date }
}, { timestamps: true });

giftCardSchema.index({ code: 1 }, { unique: true });

export default mongoose.model<IGiftCard>('GiftCard', giftCardSchema);


