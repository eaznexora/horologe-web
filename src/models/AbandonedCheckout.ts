import mongoose, { Schema, Model } from 'mongoose';

export interface IAbandonedCheckout {
  _id?: mongoose.Types.ObjectId;
  sessionKey: string; // e.g. userId or email/guest session identifier
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  timepieceId?: mongoose.Types.ObjectId;
  timepieceSlug: string;
  timepieceTitle: string;
  timepieceBrand?: string;
  timepieceReference?: string;
  timepieceImage?: string;
  timepiecePrice: number;
  shippingCity?: string;
  shippingCountry?: string;
  status: 'abandoned' | 'recovered';
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AbandonedCheckoutSchema = new Schema<IAbandonedCheckout>(
  {
    sessionKey: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, default: '' },
    customerEmail: { type: String, default: '', index: true },
    customerPhone: { type: String, default: '' },
    timepieceId: { type: Schema.Types.ObjectId, ref: 'Timepiece' },
    timepieceSlug: { type: String, default: '' },
    timepieceTitle: { type: String, default: '' },
    timepieceBrand: { type: String, default: '' },
    timepieceReference: { type: String, default: '' },
    timepieceImage: { type: String, default: '' },
    timepiecePrice: { type: Number, default: 0 },
    shippingCity: { type: String, default: '' },
    shippingCountry: { type: String, default: 'India' },
    status: {
      type: String,
      enum: ['abandoned', 'recovered'],
      default: 'abandoned',
      index: true,
    },
    lastActiveAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

if (mongoose.models.AbandonedCheckout) {
  delete mongoose.models.AbandonedCheckout;
}

export const AbandonedCheckout: Model<IAbandonedCheckout> =
  mongoose.model<IAbandonedCheckout>('AbandonedCheckout', AbandonedCheckoutSchema);

