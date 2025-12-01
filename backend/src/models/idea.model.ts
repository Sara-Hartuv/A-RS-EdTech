import mongoose, { Document } from "mongoose";

export interface IIdea extends Document {
  student: mongoose.Types.ObjectId;
  text: string;
  seen: boolean;
  status: "pending" | "reviewed" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const IdeaSchema = new mongoose.Schema<IIdea>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    },

    seen: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },

  { timestamps: true }
);

const Idea = mongoose.model<IIdea>("Idea", IdeaSchema);

export default Idea;
