import { INote } from '../models/note.model';
import mongoose from 'mongoose';
import * as noteRepository from '../repositories/note.repository';

export const getNoteById = async (noteId: string): Promise<INote | null> => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new Error('Invalid note ID');
  }

  const note = await noteRepository.findNoteById(noteId);

  if (!note) {
    throw new Error('Note not found');
  }

  return note;
};

export const getAllNotes = async (): Promise<INote[]> => {
  const notes = await noteRepository.findAllNotes();
  return notes;
};

export const getNotesByStudent = async (studentId: string): Promise<INote[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const notes = await noteRepository.findNotesByStudent(studentId);
  return notes;
};

export const getNotesByTeacher = async (teacherId: string): Promise<INote[]> => {
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new Error('Invalid teacher ID');
  }

  const notes = await noteRepository.findNotesByTeacher(teacherId);
  return notes;
};

export const getVisibleNotesForStudent = async (studentId: string): Promise<INote[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const notes = await noteRepository.findVisibleNotesForStudent(studentId);
  return notes;
};

export const createNote = async (noteData: {
  student: string;
  teacher: string;
  text: string;
  type?: 'behavior' | 'academic' | 'warning' | 'general';
  isVisibleToStudent?: boolean;
}): Promise<INote> => {
  if (!mongoose.Types.ObjectId.isValid(noteData.student)) {
    throw new Error('Invalid student ID');
  }

  if (!mongoose.Types.ObjectId.isValid(noteData.teacher)) {
    throw new Error('Invalid teacher ID');
  }

  if (!noteData.text || noteData.text.trim().length === 0) {
    throw new Error('Note text is required');
  }

  const newNote = await noteRepository.createNote({
    student: new mongoose.Types.ObjectId(noteData.student),
    teacher: new mongoose.Types.ObjectId(noteData.teacher),
    text: noteData.text.trim(),
    type: noteData.type || 'general',
    isVisibleToStudent: noteData.isVisibleToStudent !== undefined ? noteData.isVisibleToStudent : true,
    status: 'active',
  });

  return newNote;
};

export const updateNote = async (
  noteId: string,
  updateData: {
    text?: string;
    type?: 'behavior' | 'academic' | 'warning' | 'general';
    isVisibleToStudent?: boolean;
  }
): Promise<INote | null> => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new Error('Invalid note ID');
  }

  if (updateData.text !== undefined && updateData.text.trim().length === 0) {
    throw new Error('Note text cannot be empty');
  }

  const updatedNote = await noteRepository.updateNoteById(noteId, updateData);

  if (!updatedNote) {
    throw new Error('Note not found');
  }

  return updatedNote;
};

export const deleteNote = async (noteId: string): Promise<INote | null> => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new Error('Invalid note ID');
  }

  const deletedNote = await noteRepository.softDeleteNoteById(noteId);

  if (!deletedNote) {
    throw new Error('Note not found');
  }

  return deletedNote;
};
