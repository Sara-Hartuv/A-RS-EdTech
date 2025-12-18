import mongoose, { Schema, Document } from 'mongoose';

export interface IExcellenceCertificate extends Document {
  student: mongoose.Types.ObjectId;
  issuedBy: mongoose.Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const excellenceCertificateSchema = new Schema<IExcellenceCertificate>(
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
    periodStart: {
      type: Date,
      required: [true, 'Period start date is required'],
    },
    periodEnd: {
      type: Date,
      required: [true, 'Period end date is required'],
      validate: {
        validator: function (this: IExcellenceCertificate, value: Date) {
          return value > this.periodStart;
        },
        message: 'Period end date must be after period start date',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying student certificates chronologically
excellenceCertificateSchema.index({ student: 1, createdAt: -1 });

// Index for period-based queries
excellenceCertificateSchema.index({ periodStart: 1, periodEnd: 1 });

const ExcellenceCertificate = mongoose.model<IExcellenceCertificate>(
  'ExcellenceCertificate',
  excellenceCertificateSchema
);

export default ExcellenceCertificate;
