import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(200).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const products = await productService.getProductsByCategory(categoryId);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAvailableProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAvailableProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    const newProduct = await productService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedProduct = await productService.updateProduct(id, updateData);
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProductStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updatedProduct = await productService.updateProductStock(id, quantity);
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);
    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
