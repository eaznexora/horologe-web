import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInsightCategory extends Document {
  name: string;
  slug: string;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
}

const InsightCategorySchema = new Schema<IInsightCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Forced model refresh to prevent stale Next.js dev schema caches
if (mongoose.models.InsightCategory) {
  delete mongoose.models.InsightCategory;
}

export const InsightCategory: Model<IInsightCategory> =
  mongoose.model<IInsightCategory>('InsightCategory', InsightCategorySchema);

