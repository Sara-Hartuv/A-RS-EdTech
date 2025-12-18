import { Request, Response } from 'express';
import * as noteService from '../services/note.service';

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await noteService.getNoteById(id);
    res.status(200).json(note);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await noteService.getAllNotes();
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotesByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const notes = await noteService.getNotesByStudent(studentId);
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getNotesByTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId } = req.params;
    const notes = await noteService.getNotesByTeacher(teacherId);
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyNotesAsStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const notes = await noteService.getVisibleNotesForStudent(req.user.userId);
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { student, text, type, isVisibleToStudent } = req.body;

    if (!student || !text) {
      res.status(400).json({ message: 'Student and text are required' });
      return;
    }

    const noteData = {
      student,
      teacher: req.user.userId,
      text,
      type,
      isVisibleToStudent,
    };

    const newNote = await noteService.createNote(noteData);
    res.status(201).json(newNote);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { text, type, isVisibleToStudent } = req.body;

    const updateData = {
      text,
      type,
      isVisibleToStudent,
    };

    const updatedNote = await noteService.updateNote(id, updateData);
    res.status(200).json(updatedNote);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedNote = await noteService.deleteNote(id);
    res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
