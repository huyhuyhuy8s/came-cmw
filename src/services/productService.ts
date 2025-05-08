
// This is a mock service that would be replaced with actual API calls to Supabase
import { ProductOption, ProductSize } from '@/components/ProductDialog';

export interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  image: string;
  category: string;
  options?: ProductOption[];
  sizes?: ProductSize[];
}

// Mock data for demonstration
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Drip Coffee",
    description: "Batch brewed coffee",
    base_price: 3.50,
    image: "/lovable-uploads/624d2ca0-4248-41b4-80b9-aa0cfee9eb6d.png", 
    category: "Coffee",
    options: [
      { id: 1, name: "Regular", price_adjustment: 0 },
      { id: 2, name: "Strong", price_adjustment: 0.5 },
    ],
    sizes: [
      { id: 1, name: "Small", price_adjustment: 0 },
      { id: 2, name: "Medium", price_adjustment: 1 },
      { id: 3, name: "Large", price_adjustment: 2 },
    ],
  },
  {
    id: 2,
    name: "Latte",
    description: "Espresso with steamed milk",
    base_price: 4.50,
    image: "/lovable-uploads/a944091e-cc01-482f-877c-c3b474d20013.png",
    category: "Lattes & Seasonal",
    options: [
      { id: 3, name: "Regular", price_adjustment: 0 },
      { id: 4, name: "Vanilla", price_adjustment: 0.75 },
      { id: 5, name: "Caramel", price_adjustment: 0.75 },
    ],
    sizes: [
      { id: 4, name: "Small", price_adjustment: 0 },
      { id: 5, name: "Medium", price_adjustment: 1 },
      { id: 6, name: "Large", price_adjustment: 2 },
    ],
  },
  {
    id: 3,
    name: "Iced Coffee",
    description: "Brewed hot over ice",
    base_price: 4.25,
    image: "/lovable-uploads/b571cd5f-7223-4d8c-8d16-bfb5bdeef89d.png",
    category: "Other Drinks",
    options: [
      { id: 6, name: "Regular", price_adjustment: 0 },
      { id: 7, name: "Vanilla", price_adjustment: 0.75 },
      { id: 8, name: "Caramel", price_adjustment: 0.75 },
    ],
    sizes: [
      { id: 7, name: "Small", price_adjustment: 0 },
      { id: 8, name: "Medium", price_adjustment: 1 },
      { id: 9, name: "Large", price_adjustment: 2 },
    ],
  },
  {
    id: 4,
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and foam",
    base_price: 4.75,
    image: "/lovable-uploads/a944091e-cc01-482f-877c-c3b474d20013.png",
    category: "Lattes & Seasonal",
    options: [
      { id: 9, name: "Regular", price_adjustment: 0 },
      { id: 10, name: "Extra foam", price_adjustment: 0 },
    ],
    sizes: [
      { id: 10, name: "Small", price_adjustment: 0 },
      { id: 11, name: "Medium", price_adjustment: 1 },
      { id: 12, name: "Large", price_adjustment: 2 },
    ],
  },
  {
    id: 5,
    name: "Cold Brew",
    description: "Steeped for 12 hours",
    base_price: 4.75,
    image: "/lovable-uploads/624d2ca0-4248-41b4-80b9-aa0cfee9eb6d.png",
    category: "Other Drinks",
    options: [
      { id: 11, name: "Regular", price_adjustment: 0 },
      { id: 12, name: "Vanilla", price_adjustment: 0.75 },
      { id: 13, name: "Caramel", price_adjustment: 0.75 },
    ],
    sizes: [
      { id: 13, name: "Small", price_adjustment: 0 },
      { id: 14, name: "Medium", price_adjustment: 1 },
      { id: 15, name: "Large", price_adjustment: 2 },
    ],
  },
  {
    id: 6,
    name: "Mocha",
    description: "Espresso with chocolate and steamed milk",
    base_price: 5.25,
    image: "/lovable-uploads/a944091e-cc01-482f-877c-c3b474d20013.png",
    category: "Lattes & Seasonal",
    options: [
      { id: 14, name: "Regular", price_adjustment: 0 },
      { id: 15, name: "White chocolate", price_adjustment: 0.75 },
      { id: 16, name: "Extra chocolate", price_adjustment: 0.75 },
    ],
    sizes: [
      { id: 16, name: "Small", price_adjustment: 0 },
      { id: 17, name: "Medium", price_adjustment: 1 },
      { id: 18, name: "Large", price_adjustment: 2 },
    ],
  },
];

// Define categories
const CATEGORIES = ["Coffee", "Lattes & Seasonal", "Non Food Item", "Merchandise", "Other Drinks"];

// Service functions
export const getProducts = async (): Promise<Product[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(PRODUCTS), 500);
  });
};

export const getProductById = async (id: number): Promise<Product | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    const product = PRODUCTS.find(p => p.id === id) || null;
    setTimeout(() => resolve(product), 300);
  });
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    const filteredProducts = PRODUCTS.filter(p => p.category === category);
    setTimeout(() => resolve(filteredProducts), 500);
  });
};

export const getCategories = async (): Promise<string[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(CATEGORIES), 300);
  });
};
