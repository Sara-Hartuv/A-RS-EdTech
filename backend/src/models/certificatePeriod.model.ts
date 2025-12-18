import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificatePeriod extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  maxVouchers: number;
  requiredForCertificate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const certificatePeriodSchema = new Schema<ICertificatePeriod>(
  {
    name: {
      type: String,
      required: [true, 'Period name is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    maxVouchers: {
      type: Number,
      default: 6,
      min: [1, 'maxVouchers must be at least 1'],
    },
    requiredForCertificate: {
      type: Number,
      default: 5,
      min: [1, 'requiredForCertificate must be at least 1'],
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for querying active period quickly


// Prevent overlapping periods on DB level is complex; validations are handled in service layer

const CertificatePeriod = mongoose.model<ICertificatePeriod>('CertificatePeriod', certificatePeriodSchema);

export default CertificatePeriod;
