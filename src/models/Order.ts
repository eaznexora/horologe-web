import mongoose, { Schema, Model } from 'mongoose';

export interface IOrderItem {
  timepieceId: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  model: string;
  reference: string;
  price: number;
  image: string;
}

export interface IOrderShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IOrderFinancials {
  subtotal: number;
  tax: number;
  totalAmount: number;
  currency: string;
}

export interface IOrderPaymentGateway {
  gateway: string; // "razorpay"
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentStatus: 'pending' | 'captured' | 'failed';
}

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  orderNumber: string; // e.g. "HR-2026-XXXX"
  userId?: mongoose.Types.ObjectId;
  customerSnapshot: {
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  shippingAddress: IOrderShippingAddress;
  financials: IOrderFinancials;
  paymentGateway: IOrderPaymentGateway;
  fulfillmentStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    timepieceId: { type: Schema.Types.ObjectId, ref: 'Timepiece' },
    name: { type: String, required: true },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    reference: { type: String, default: '' },
    price: { type: Number, required: true },
    image: { type: String, default: '/logo.png' },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IOrderShippingAddress>(
  {
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const FinancialsSchema = new Schema<IOrderFinancials>(
  {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
  },
  { _id: false }
);

const PaymentGatewaySchema = new Schema<IOrderPaymentGateway>(
  {
    gateway: { type: String, default: 'razorpay' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'captured', 'failed'],
      default: 'pending',
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    customerSnapshot: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, required: true },
    },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    financials: { type: FinancialsSchema, required: true },
    paymentGateway: { type: PaymentGatewaySchema, default: () => ({}) },
    fulfillmentStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

