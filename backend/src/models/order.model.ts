import mongoose, { Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  priceAtOrder: number;
}

export interface IOrder extends Document {
  student: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalCost: number;
  status:  "newOrder" | "preparing" | "delivered"
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new mongoose.Schema<IOrderItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    priceAtOrder: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function(items: IOrderItem[]) {
          return items && items.length > 0;
        },
        message: "Order must contain at least one item"
      }
    },

    totalCost: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["newOrder", "preparing", "delivered"],
      default: "newOrder"
    }
  },

  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
