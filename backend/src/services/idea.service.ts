import { IIdea } from '../models/idea.model';
import mongoose from 'mongoose';
import * as ideaRepository from '../repositories/idea.repository';

// GET - קבלת רעיון לפי ID
export const getIdeaById = async (ideaId: string): Promise<IIdea | null> => {
  if (!mongoose.Types.ObjectId.isValid(ideaId)) {
    throw new Error('Invalid idea ID');
  }
  
  const idea = await ideaRepository.findIdeaById(ideaId);
  
  if (!idea) {
    throw new Error('Idea not found');
  }
  
  return idea;
};

// GET - קבלת כל הרעיונות
export const getAllIdeas = async (): Promise<IIdea[]> => {
  const ideas = await ideaRepository.findAllIdeas();
  return ideas;
};

// GET - קבלת רעיונות לפי סטטוס
export const getIdeasByStatus = async (status: string): Promise<IIdea[]> => {
  const ideas = await ideaRepository.findIdeasByQuery({ status });
  return ideas;
};

// GET - קבלת רעיונות לפי סטודנט
export const getIdeasByStudent = async (studentId: string): Promise<IIdea[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }
  
  const ideas = await ideaRepository.findIdeasByStudent(studentId);
  return ideas;
};

// GET - קבלת רעיונות שלא נצפו
export const getUnseenIdeas = async (): Promise<IIdea[]> => {
  const ideas = await ideaRepository.findIdeasByQuery({ seen: false });
  return ideas;
};

// POST - יצירת רעיון חדש
export const createIdea = async (ideaData: Partial<IIdea>): Promise<IIdea> => {
  // וולידציה על השדות הנדרשים
  if (!ideaData.student || !ideaData.text) {
    throw new Error('Student and text are required');
  }

  if (!mongoose.Types.ObjectId.isValid(ideaData.student.toString())) {
    throw new Error('Invalid student ID');
  }

  const newIdea = await ideaRepository.createNewIdea(ideaData);
  return newIdea;
};

// PUT - עדכון רעיון לפי ID
export const updateIdea = async (
  ideaId: string,
  updateData: Partial<IIdea>
): Promise<IIdea | null> => {
  if (!mongoose.Types.ObjectId.isValid(ideaId)) {
    throw new Error('Invalid idea ID');
  }

  const updatedIdea = await ideaRepository.updateIdeaById(ideaId, updateData);
  
  if (!updatedIdea) {
    throw new Error('Idea not found');
  }

  return updatedIdea;
};

// PUT - סימון רעיון כנצפה
export const markIdeaAsSeen = async (ideaId: string): Promise<IIdea | null> => {
  if (!mongoose.Types.ObjectId.isValid(ideaId)) {
    throw new Error('Invalid idea ID');
  }

  const updatedIdea = await ideaRepository.updateIdeaById(ideaId, { seen: true });
  
  if (!updatedIdea) {
    throw new Error('Idea not found');
  }

  return updatedIdea;
};

// DELETE - מחיקת רעיון
export const deleteIdea = async (ideaId: string): Promise<IIdea | null> => {
  if (!mongoose.Types.ObjectId.isValid(ideaId)) {
    throw new Error('Invalid idea ID');
  }

  const deletedIdea = await ideaRepository.deleteIdeaById(ideaId);
  
  if (!deletedIdea) {
    throw new Error('Idea not found');
  }

  return deletedIdea;
};
