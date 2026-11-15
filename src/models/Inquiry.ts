import mongoose, { Schema, Model } from 'mongoose';

export interface IInquiryTimepiece {
  timepieceId?: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  brand?: string;
  reference?: string;
  price?: number;
  image?: string;
}

export interface IInquiry {
  _id?: mongoose.Types.ObjectId;
  type: 'watch' | 'general';
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  timepiece?: IInquiryTimepiece;
  status: 'new' | 'in_review' | 'resolved';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquiryTimepieceSchema = new Schema<IInquiryTimepiece>(
  {
    timepieceId: { type: Schema.Types.ObjectId, ref: 'Timepiece' },
    slug: { type: String, default: '' },
    title: { type: String, default: '' },
    brand: { type: String, default: '' },
    reference: { type: String, default: '' },
    price: { type: Number, default: 0 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const InquirySchema = new Schema<IInquiry>(
  {
    type: {
      type: String,
      enum: ['watch', 'general'],
      default: 'general',
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, default: '', trim: true },
    message: { type: String, required: true, trim: true },
    timepiece: { type: InquiryTimepieceSchema, default: null },
    status: {
      type: String,
      enum: ['new', 'in_review', 'resolved'],
      default: 'new',
      index: true,
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

if (mongoose.models.Inquiry) {
  delete mongoose.models.Inquiry;
}

export const Inquiry: Model<IInquiry> =
  mongoose.model<IInquiry>('Inquiry', InquirySchema);

