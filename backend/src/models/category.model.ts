import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  status?: boolean;
}

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
