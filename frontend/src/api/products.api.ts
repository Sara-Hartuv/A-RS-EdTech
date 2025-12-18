// src/api/products.api.ts
import { api } from "./api";
import type { Product } from "../types/product";

export const getAllProducts = () => {
  return api.get<Product[]>('/products/');
};

export const getAvailableProducts = () => {
  return api.get<Product[]>('/products/available');
};
