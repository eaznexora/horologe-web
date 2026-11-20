import mongoose, { Schema, Model } from 'mongoose';

export interface ISiteBanner {
  _id?: mongoose.Types.ObjectId;
  page: 'home' | 'collections' | 'sell-your-luxury' | 'concierge' | 'auth' | 'insights';
  slotKey: string;
  desktopUrl: string;
  mobileUrl?: string;
  linkUrl?: string;
  mediaType: 'image' | 'video';
  createdAt: Date;
  updatedAt: Date;
}

const SiteBannerSchema = new Schema<ISiteBanner>(
  {
    page: {
      type: String,
      enum: ['home', 'collections', 'sell-your-luxury', 'concierge', 'auth', 'insights'],
      required: true,
      index: true,
    },
    slotKey: {
      type: String,
      required: true,
      index: true,
    },
    desktopUrl: {
      type: String,
      required: true,
      default: '',
    },
    mobileUrl: {
      type: String,
      default: '',
    },
    linkUrl: {
      type: String,
      default: '',
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness per page and slotKey
SiteBannerSchema.index({ page: 1, slotKey: 1 }, { unique: true });

// Forced model refresh to prevent stale Next.js dev schema caches
if (mongoose.models.SiteBanner) {
  delete mongoose.models.SiteBanner;
}

export const SiteBanner: Model<ISiteBanner> =
  mongoose.model<ISiteBanner>('SiteBanner', SiteBannerSchema);
