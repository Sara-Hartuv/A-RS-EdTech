import { IProduct } from '../models/product.model';
import mongoose from 'mongoose';
import * as productRepository from '../repositories/product.repository';

// GET - קבלת מוצר לפי ID
export const getProductById = async (productId: string): Promise<IProduct | null> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }
  
  const product = await productRepository.findProductById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
};

// GET - קבלת כל המוצרים
export const getAllProducts = async (): Promise<IProduct[]> => {
  const products = await productRepository.findAllProducts();
  return products;
};

// GET - קבלת מוצרים לפי קטגוריה
export const getProductsByCategory = async (categoryId: string): Promise<IProduct[]> => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid category ID');
  }
  
  const products = await productRepository.findProductsByCategory(categoryId);
  return products;
};

// GET - קבלת מוצרים זמינים במלאי
export const getAvailableProducts = async (): Promise<IProduct[]> => {
  const products = await productRepository.findProductsByQuery({ stock: { $gt: 0 } });
  return products;
};

// POST - יצירת מוצר חדש
export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  // בדיקת קיום מוצר עם אותו שם
  if (productData.name) {
    const existingProduct = await productRepository.findProductByName(productData.name);
    
    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }
  }

  // וולידציה על השדות הנדרשים
  if (!productData.name || !productData.category || !productData.costInVouchers || productData.stock === undefined) {
    throw new Error('Name, category, costInVouchers, and stock are required');
  }

  if (!mongoose.Types.ObjectId.isValid(productData.category.toString())) {
    throw new Error('Invalid category ID');
  }

  if (productData.costInVouchers < 1) {
    throw new Error('Cost must be at least 1 voucher');
  }

  if (productData.stock < 0) {
    throw new Error('Stock cannot be negative');
  }

  const newProduct = await productRepository.createNewProduct(productData);
  return newProduct;
};

// PUT - עדכון מוצר לפי ID
export const updateProduct = async (
  productId: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  // אם מעדכנים שם, לוודא שהוא לא קיים אצל מוצר אחר
  if (updateData.name) {
    const existingProduct = await productRepository.findProductByName(updateData.name);
    if (existingProduct && existingProduct.id !== productId) {
      throw new Error('Product name already in use by another product');
    }
  }

  // וולידציה על ערכים
  if (updateData.costInVouchers && updateData.costInVouchers < 1) {
    throw new Error('Cost must be at least 1 voucher');
  }

  if (updateData.stock !== undefined && updateData.stock < 0) {
    throw new Error('Stock cannot be negative');
  }

  const updatedProduct = await productRepository.updateProductById(productId, updateData);
  
  if (!updatedProduct) {
    throw new Error('Product not found');
  }

  return updatedProduct;
};

// PUT - עדכון מלאי מוצר
export const updateProductStock = async (
  productId: string,
  quantity: number
): Promise<IProduct | null> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  const product = await productRepository.findProductById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }

  // בדיקה שהמלאי לא יירד מתחת ל-0
  if (product.stock + quantity < 0) {
    throw new Error('Insufficient stock');
  }

  const updatedProduct = await productRepository.updateProductStock(productId, quantity);
  return updatedProduct;
};

// DELETE - מחיקת מוצר
export const deleteProduct = async (productId: string): Promise<IProduct | null> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  const deletedProduct = await productRepository.deleteProductById(productId);
  
  if (!deletedProduct) {
    throw new Error('Product not found');
  }

  return deletedProduct;
};
