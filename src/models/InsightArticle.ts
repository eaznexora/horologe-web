import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInsightArticle extends Document {
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  author: string;
  pullQuote: string;
  content: string[];
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const InsightArticleSchema = new Schema<IInsightArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    readTime: {
      type: String,
      default: '5 MIN READ',
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: 'Horologe Royale Editorial Desk',
      trim: true,
    },
    pullQuote: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Forced model refresh to prevent stale Next.js dev schema caches
if (mongoose.models.InsightArticle) {
  delete mongoose.models.InsightArticle;
}

export const InsightArticle: Model<IInsightArticle> =
  mongoose.model<IInsightArticle>('InsightArticle', InsightArticleSchema);

