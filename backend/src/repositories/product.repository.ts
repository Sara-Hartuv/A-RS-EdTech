import Product, { IProduct } from '../models/product.model';

export const findProductById = async (productId: string): Promise<IProduct | null> => {
  return await Product.findById(productId).populate('category');
};

export const findAllProducts = async (): Promise<IProduct[]> => {
  return await Product.find().populate('category');
};

export const findProductsByQuery = async (query: any): Promise<IProduct[]> => {
  return await Product.find(query).populate('category');
};

export const findProductsByCategory = async (categoryId: string): Promise<IProduct[]> => {
  return await Product.find({ category: categoryId }).populate('category');
};

export const findProductByName = async (name: string): Promise<IProduct | null> => {
  return await Product.findOne({ name }).populate('category');
};

export const createNewProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

export const updateProductById = async (
  productId: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('category');
};

// Delete product
export const deleteProductById = async (productId: string): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(
    productId,
    { $set: { isActive: false } },
    { new: true }
  );
};

export const updateProductStock = async (
  productId: string,
  quantity: number
): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: quantity } },
    { new: true }
  ).populate('category');
};

export const incrementPurchaseCount = async (productId: string): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { purchasesCount: 1 } },
    { new: true }
  ).populate('category');
};
