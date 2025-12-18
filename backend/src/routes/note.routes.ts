import { Router } from 'express';
import * as noteController from '../controllers/note.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Get all notes (admin/teacher only)
router.get(
  '/',
  authenticate,
  authorize('admin', 'teacher'),
  noteController.getAllNotes
);

// Get note by ID (admin/teacher only)
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'teacher'),
  noteController.getNoteById
);

// Get notes by student ID (admin/teacher only)
router.get(
  '/student/:studentId',
  authenticate,
  authorize('admin', 'teacher'),
  noteController.getNotesByStudent
);

// Get notes by teacher ID (admin/teacher only)
router.get(
  '/teacher/:teacherId',
  authenticate,
  authorize('admin', 'teacher'),
  noteController.getNotesByTeacher
);

// Get my notes as a student (student only)
router.get(
  '/my/student-notes',
  authenticate,
  authorize('student'),
  noteController.getMyNotesAsStudent
);

// Create note (teacher only)
router.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
  noteController.createNote
);

// Update note (teacher/admin only)
router.put(
  '/:id',
  authenticate,
  authorize('teacher', 'admin'),
  noteController.updateNote
);

// Delete note (soft delete) (teacher/admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('teacher', 'admin'),
  noteController.deleteNote
);

export default router;
