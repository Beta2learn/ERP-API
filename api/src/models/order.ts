
import mongoose, { Schema, Document } from 'mongoose';

 export enum OrderStatus {
   Pending = "Pending",
   Shipped = "Shipped",
   Delivered = "Delivered",
   Canceled = "Canceled",
 }

interface IOrder extends Document {
  clientId: string;
  products: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: Date; 
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
    },
  },
  { timestamps: true } 
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
