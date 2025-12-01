import mongoose, { Document } from "mongoose";

export interface IOrder extends Document {
  student: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  status: "draft" | "pendingApproval" | "approved" | "delivered"
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1
    },

    status: {
      type: String,
      enum: ["draft", "pendingApproval", "approved", "delivered"],
      default: "draft"
    }
  },

  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
