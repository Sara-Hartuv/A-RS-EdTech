import Category, { ICategory } from '../models/category.model';

export const findCategoryById = async (categoryId: string): Promise<ICategory | null> => {
  return await Category.findById(categoryId);
};

export const findAllCategories = async (): Promise<ICategory[]> => {
  return await Category.find();
};

export const findCategoryByName = async (name: string): Promise<ICategory | null> => {
  return await Category.findOne({ name });
};

export const createNewCategory = async (categoryData: Partial<ICategory>): Promise<ICategory> => {
  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

export const updateCategoryById = async (
  categoryId: string,
  updateData: Partial<ICategory>
): Promise<ICategory | null> => {
  return await Category.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteCategoryById = async (categoryId: string): Promise<ICategory | null> => {
  return await Category.findByIdAndUpdate(
    categoryId,
    { $set: { isActive: false } },
    { new: true }
  );
};
