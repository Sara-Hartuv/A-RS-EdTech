import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  passwordHash: string;
  role: 'teacher' | 'student' | 'admin';
  students: mongoose.Types.ObjectId[];
  points: number;
  vouchers: number;
  bubbleVouchers: number;
  comments?: string;  
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["teacher", "student", "admin"],
      required: true
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
      }
    ],

    points: {
      type: Number,
      default: 0
    },

    vouchers: {
      type: Number,
      default: 0
    },
    bubbleVouchers: {
      type: Number,
      default: 0
    },
    comments: {
      type: String,
      trim: true
    },

    status: {
      type: Boolean,
      default: true
    }
  },

  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
