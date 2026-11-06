import { Product, ProductsResponse } from "../types/product";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://dummyjson.com";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products?limit=100`);

  if (!response.ok) {
    throw new Error("Unable to fetch products. Please try again.");
  }

  const data: ProductsResponse = await response.json();

  return data.products;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Unable to fetch product details.");
  }

  return response.json();
}
