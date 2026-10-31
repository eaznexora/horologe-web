import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWatchCategory extends Document {
  name: string;
  slug: string;
  rank: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const WatchCategorySchema = new Schema<IWatchCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rank: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const WatchCategory: Model<IWatchCategory> =
  mongoose.models.WatchCategory || mongoose.model<IWatchCategory>('WatchCategory', WatchCategorySchema);
