import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    res.status(200).json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryData = req.body;
    const newCategory = await categoryService.createCategory(categoryData);
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCategory = await categoryService.updateCategory(id, updateData);
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryService.deleteCategory(id);
    res.status(200).json({ message: 'Category deleted successfully', category: deletedCategory });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
