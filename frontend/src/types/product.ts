// src/types/product.ts

export interface Product {
  _id: string;
  name: string;
  description?: string;
  costInVouchers: number;
  stock: number;
  imageUrl?: string;
  category?: string | { _id: string; name?: string };
}
