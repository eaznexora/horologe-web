import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPillar {
  title: string;
  description: string;
}

export interface IKeySpec {
  label: string;
  value: string;
}

export interface ITimepieceSeo {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
}

export interface ITimepiece extends Document {
  name: string;
  slug: string;
  images: string[]; // Array of up to 4 image URLs
  minorSpecs: string[]; // Array of up to 3 strings (e.g. ['Chronograph', 'Automatic', 'Oystersteel'])
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  watchCategory?: mongoose.Types.ObjectId;
  conditionBadge: string;
  gradeBadge: string;
  scopeBadge: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  heritageHeadline: string;
  heritageStory: string;
  pillars: IPillar[]; // Up to 3
  keySpecs: IKeySpec[]; // Dynamic array
  seo: ITimepieceSeo;
  status: 'active' | 'draft' | 'sold';
  createdAt: Date;
  updatedAt: Date;
}

const PillarSchema = new Schema<IPillar>(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const KeySpecSchema = new Schema<IKeySpec>(
  {
    label: { type: String, default: '' },
    value: { type: String, default: '' },
  },
  { _id: false }
);

const SeoSchema = new Schema<ITimepieceSeo>(
  {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);

const TimepieceSchema = new Schema<ITimepiece>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    images: { type: [String], default: [] },
    minorSpecs: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    watchCategory: { type: Schema.Types.ObjectId, ref: 'WatchCategory', default: null },
    conditionBadge: { type: String, default: 'Preowned' },
    gradeBadge: { type: String, default: 'Excellent Condition' },
    scopeBadge: { type: String, default: 'Full Set' },
    tagline: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    heritageHeadline: { type: String, default: '' },
    heritageStory: { type: String, default: '' },
    pillars: { type: [PillarSchema], default: [] },
    keySpecs: { type: [KeySpecSchema], default: [] },
    seo: { type: SeoSchema, default: () => ({}) },
    status: { type: String, enum: ['active', 'draft', 'sold'], default: 'active' },
  },
  { timestamps: true }
);

export const Timepiece: Model<ITimepiece> =
  mongoose.models.Timepiece || mongoose.model<ITimepiece>('Timepiece', TimepieceSchema);
