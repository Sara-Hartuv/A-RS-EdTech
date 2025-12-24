import mongoose, { Schema, Document } from 'mongoose';

export interface IWeeklyPointsLog extends Document {
  student: mongoose.Types.ObjectId;
  points: number;
  weekStartDate: Date;
  approvedBy: mongoose.Types.ObjectId;
  hasVoucher: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const weeklyPointsLogSchema = new Schema<IWeeklyPointsLog>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
      index: true,
    },
    points: {
      type: Number,
      required: [true, 'Points are required'],
      min: [0, 'Points cannot be negative'],
    },
    weekStartDate: {
      type: Date,
      required: [true, 'Week start date is required'],
      index: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Approver is required'],
    },
    hasVoucher: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate weekly entries for the same student
weeklyPointsLogSchema.index({ student: 1, weekStartDate: 1 }, { unique: true });

// Index for querying student's point history chronologically
weeklyPointsLogSchema.index({ student: 1, weekStartDate: -1 });

const WeeklyPointsLog = mongoose.model<IWeeklyPointsLog>(
  'WeeklyPointsLog',
  weeklyPointsLogSchema
);

export default WeeklyPointsLog;
