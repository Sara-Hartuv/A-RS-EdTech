import { Request, Response } from 'express';
import * as ideaService from '../services/idea.service';

export const getIdeaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idea = await ideaService.getIdeaById(id);
    res.status(200).json(idea);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllIdeas = async (req: Request, res: Response): Promise<void> => {
  try {
    const ideas = await ideaService.getAllIdeas();
    res.status(200).json(ideas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getIdeasByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;
    const ideas = await ideaService.getIdeasByStatus(status);
    res.status(200).json(ideas);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getIdeasByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const ideas = await ideaService.getIdeasByStudent(studentId);
    res.status(200).json(ideas);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUnseenIdeas = async (req: Request, res: Response): Promise<void> => {
  try {
    const ideas = await ideaService.getUnseenIdeas();
    res.status(200).json(ideas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createIdea = async (req: Request, res: Response): Promise<void> => {
  try {
    const ideaData = req.body;
    const newIdea = await ideaService.createIdea(ideaData);
    res.status(201).json(newIdea);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateIdea = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedIdea = await ideaService.updateIdea(id, updateData);
    res.status(200).json(updatedIdea);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const markIdeaAsSeen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedIdea = await ideaService.markIdeaAsSeen(id);
    res.status(200).json(updatedIdea);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteIdea = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedIdea = await ideaService.deleteIdea(id);
    res.status(200).json({ message: 'Idea deleted successfully', idea: deletedIdea });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
