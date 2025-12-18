import mongoose, { Schema, Document } from 'mongoose';

export interface IVoucher extends Document {
  student: mongoose.Types.ObjectId;
  issuedBy: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId | null;
  period?: mongoose.Types.ObjectId | null;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId | null;
  approvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const voucherSchema = new Schema<IVoucher>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
      index: true,
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Issuer is required'],
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
      index: true,
    },
    period: {
      type: Schema.Types.ObjectId,
      ref: 'CertificatePeriod',
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries on student vouchers and redemption status
voucherSchema.index({ student: 1, order: 1 });

// Index for tracking unredeemed vouchers
voucherSchema.index({ student: 1, createdAt: -1 });

const Voucher = mongoose.model<IVoucher>('Voucher', voucherSchema);

export default Voucher;
