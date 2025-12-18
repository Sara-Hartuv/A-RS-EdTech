import Note, { INote } from '../models/note.model';
import mongoose from 'mongoose';

export const findNoteById = async (noteId: string): Promise<INote | null> => {
  return await Note.findOne({ _id: noteId, status: 'active' })
    .populate('student', 'name phone role')
    .populate('teacher', 'name phone role');
};

export const findAllNotes = async (): Promise<INote[]> => {
  return await Note.find({ status: 'active' })
    .populate('student', 'name phone role')
    .populate('teacher', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findNotesByQuery = async (query: any): Promise<INote[]> => {
  return await Note.find({ ...query, status: 'active' })
    .populate('student', 'name phone role')
    .populate('teacher', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findNotesByStudent = async (studentId: string): Promise<INote[]> => {
  return await Note.find({ student: studentId, status: 'active' })
    .populate('teacher', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findNotesByTeacher = async (teacherId: string): Promise<INote[]> => {
  return await Note.find({ teacher: teacherId, status: 'active' })
    .populate('student', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findVisibleNotesForStudent = async (studentId: string): Promise<INote[]> => {
  return await Note.find({
    student: studentId,
    status: 'active',
    isVisibleToStudent: true
  })
    .populate('teacher', 'name phone role')
    .sort({ createdAt: -1 });
};

export const createNote = async (noteData: Partial<INote>): Promise<INote> => {
  const newNote = new Note(noteData);
  return await newNote.save();
};

export const updateNoteById = async (
  noteId: string,
  updateData: Partial<INote>
): Promise<INote | null> => {
  return await Note.findOneAndUpdate(
    { _id: noteId, status: 'active' },
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('student', 'name phone role')
    .populate('teacher', 'name phone role');
};

export const softDeleteNoteById = async (noteId: string): Promise<INote | null> => {
  return await Note.findByIdAndUpdate(
    noteId,
    { status: 'deleted' },
    { new: true }
  );
};

export const hardDeleteNoteById = async (noteId: string): Promise<INote | null> => {
  return await Note.findByIdAndDelete(noteId);
};
