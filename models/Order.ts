import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  customerName: string;
  email: string;
  contactNumber: string;
  shippingAddress: string;
  productName: string;
  quantity: number;
  productImage?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  customerName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  shippingAddress: {
    type: String,
    required: true,
    maxlength: 100
  },
  productName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  productImage: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema);