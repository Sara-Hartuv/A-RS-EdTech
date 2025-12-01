import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  description?: string;
  imageUrl?: string;
  costInVouchers: number;
  stock: number;
  purchasesCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    description: {
      type: String,
      trim: true
    },

    imageUrl: {
      type: String,
      trim: true
    },

    costInVouchers: {
      type: Number,
      required: true,
      min: 1
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    purchasesCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }

  },

  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
