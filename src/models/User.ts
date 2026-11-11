import mongoose, { Schema, Model } from 'mongoose';

export interface IAddress {
  _id?: string;
  tag: string; // "Primary Vault", "Residence", "Office"
  isDefault: boolean;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  country?: string;
  role: 'customer' | 'admin';
  status?: 'active' | 'blocked';
  blockedAt?: Date;
  blockReason?: string;
  appealMessage?: {
    message: string;
    submittedAt?: Date;
    status: 'none' | 'pending' | 'reviewed';
  };
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    tag: { type: String, default: 'Residence' },
    isDefault: { type: Boolean, default: false },
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, required: true },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    phone: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    blockedAt: { type: Date },
    blockReason: { type: String, default: '' },
    appealMessage: {
      message: { type: String, default: '' },
      submittedAt: { type: Date },
      status: { type: String, enum: ['none', 'pending', 'reviewed'], default: 'none' },
    },
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Timepiece' }],
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

