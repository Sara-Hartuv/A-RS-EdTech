import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  inActive?: boolean;
}

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    inActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
