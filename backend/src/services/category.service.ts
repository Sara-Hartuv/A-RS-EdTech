import { ICategory } from '../models/category.model';
import mongoose from 'mongoose';
import * as categoryRepository from '../repositories/category.repository';

// GET - get category by ID
export const getCategoryById = async (categoryId: string): Promise<ICategory | null> => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid category ID');
  }
  
  const category = await categoryRepository.findCategoryById(categoryId);
  
  if (!category) {
    throw new Error('Category not found');
  }
  
  return category;
};

// GET - get all categories
export const getAllCategories = async (): Promise<ICategory[]> => {
  const categories = await categoryRepository.findAllCategories();
  return categories;
};

// POST - create new category
export const createCategory = async (categoryData: Partial<ICategory>): Promise<ICategory> => {
  // Check if category with same name exists
  if (categoryData.name) {
    const existingCategory = await categoryRepository.findCategoryByName(categoryData.name);
    
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
  }

  // Validate required fields
  if (!categoryData.name) {
    throw new Error('Category name is required');
  }

  const newCategory = await categoryRepository.createNewCategory(categoryData);
  return newCategory;
};

// PUT - update category by ID
export const updateCategory = async (
  categoryId: string,
  updateData: Partial<ICategory>
): Promise<ICategory | null> => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid category ID');
  }

  // If updating name, ensure it doesn't exist in another category
  if (updateData.name) {
    const existingCategory = await categoryRepository.findCategoryByName(updateData.name);
    if (existingCategory && existingCategory.id !== categoryId) {
      throw new Error('Category name already in use by another category');
    }
  }

  const updatedCategory = await categoryRepository.updateCategoryById(categoryId, updateData);
  
  if (!updatedCategory) {
    throw new Error('Category not found');
  }

  return updatedCategory;
};

// DELETE - delete category
export const deleteCategory = async (categoryId: string): Promise<ICategory | null> => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid category ID');
  }

  const deletedCategory = await categoryRepository.deleteCategoryById(categoryId);
  
  if (!deletedCategory) {
    throw new Error('Category not found');
  }

  return deletedCategory;
};
