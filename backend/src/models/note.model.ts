import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  student: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  text: string;
  type: 'behavior' | 'academic' | 'warning' | 'general';
  isVisibleToStudent: boolean;
  status: 'active' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
      index: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher is required'],
    },
    text: {
      type: String,
      required: [true, 'Note text is required'],
      trim: true,
      minlength: [1, 'Note text cannot be empty'],
      maxlength: [2000, 'Note text cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['behavior', 'academic', 'warning', 'general'],
        message: '{VALUE} is not a valid note type',
      },
      default: 'general',
    },
    isVisibleToStudent: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'deleted'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying student notes chronologically (active only)
noteSchema.index({ student: 1, status: 1, createdAt: -1 });

// Index for filtering notes by type and visibility (active only)
noteSchema.index({ student: 1, status: 1, type: 1, isVisibleToStudent: 1 });

// Index for teacher's notes
noteSchema.index({ teacher: 1, createdAt: -1 });

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;
