import { createContext } from 'react';

export interface Product {
  id: number;
  name: string;
  image: string;
  images: string[];
  price: string;
  category: string;
  description?: string;
  bulkPricing?: { minQuantity: number; price: string }[];
  rating: number;
  reviewCount: number;
  stockQuantity?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  variants?: { color?: string; size?: string }[];
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface ProductContextType {
  products: Product[];
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  getCartItemCount: () => number;
  isLoading: boolean;
  error: string | null;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  getCartItemCount: () => 0,
  isLoading: false,
  error: null,
});

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Smartphone X',
    image: 'https://picsum.photos/id/1015/300/200',
    images: [
      'https://picsum.photos/id/1015/600/400',
      'https://picsum.photos/id/1018/600/400',
      'https://picsum.photos/id/1019/600/400',
    ],
    price: '$499.99',
    category: 'Electronics',
    description: 'A high-performance smartphone with advanced features, perfect for bulk purchases.',
    bulkPricing: [
      { minQuantity: 10, price: '$479.99' },
      { minQuantity: 50, price: '$459.99' },
    ],
    rating: 0,
    reviewCount: 0,
    stockQuantity: 100,
    isNew: true,
    isOnSale: false,
    variants: [{ color: 'Black' }, { color: 'Silver' }],
  },
  {
    id: 2,
    name: 'Leather Jacket',
    image: 'https://picsum.photos/id/1020/300/200',
    images: [
      'https://picsum.photos/id/1020/600/400',
      'https://picsum.photos/id/1021/600/400',
    ],
    price: '$89.99',
    category: 'Clothing',
    description: 'Premium leather jacket, ideal for retail or wholesale.',
    bulkPricing: [
      { minQuantity: 20, price: '$79.99' },
      { minQuantity: 100, price: '$69.99' },
    ],
    rating: 0,
    reviewCount: 0,
    stockQuantity: 50,
    isNew: false,
    isOnSale: true,
    variants: [{ size: 'M' }, { size: 'L' }],
  },
  {
    id: 3,
    name: 'Wooden Table',
    image: 'https://picsum.photos/id/1025/300/200',
    images: ['https://picsum.photos/id/1025/600/400'],
    price: '$299.99',
    category: 'Furniture',
    description: 'Sturdy wooden table for home or office use.',
    rating: 0,
    reviewCount: 0,
    stockQuantity: 20,
    isNew: false,
    isOnSale: false,
  },
  {
    id: 4,
    name: 'Wireless Earbuds',
    image: 'https://picsum.photos/id/1033/300/200',
    images: ['https://picsum.photos/id/1033/600/400'],
    price: '$129.99',
    category: 'Electronics',
    description: 'High-quality wireless earbuds with noise cancellation.',
    rating: 0,
    reviewCount: 0,
    stockQuantity: 150,
    isNew: true,
    isOnSale: false,
    variants: [{ color: 'White' }, { color: 'Black' }],
  },
  {
    id: 5,
    name: 'Denim Jeans',
    image: 'https://picsum.photos/id/1040/300/200',
    images: ['https://picsum.photos/id/1040/600/400'],
    price: '$59.99',
    category: 'Clothing',
    description: 'Comfortable and stylish denim jeans.',
    rating: 0,
    reviewCount: 0,
    stockQuantity: 80,
    isNew: false,
    isOnSale: true,
    variants: [{ size: 'S' }, { size: 'M' }, { size: 'L' }],
  },
  {
    id: 6,
    name: 'Sofa Set',
    image: 'https://picsum.photos/id/1047/300/200',
    images: ['https://picsum.photos/id/1047/600/400'],
    price: '$799.99',
    category: 'Furniture',
    description: 'Elegant sofa set for modern living spaces.',
    rating: 0,
    reviewCount: 0,
    stockQuantity: 10,
    isNew: false,
    isOnSale: false,
  },
  {
    id: 7,
    name: 'Laptop Pro',
    image: 'https://picsum.photos/id/1050/300/200',
    images: ['https://picsum.photos/id/1050/600/400'],
    price: '$999.99',
    category: 'Electronics',
    description: 'Powerful laptop for professional use.',
    rating: 0,
    reviewCount: 0,
    stockQuantity: 30,
    isNew: true,
    isOnSale: false,
    variants: [{ color: 'Silver' }, { color: 'Space Gray' }],
  },
  {
    id: 8,
    name: 'Winter Coat',
    image: 'https://picsum.photos/id/1060/300/200',
    images: ['https://picsum.photos/id/1060/600/400'],
    price: '$149.99',
    category: 'Clothing',
    description: 'Warm and stylish winter coat.',
    rating: 0,
    reviewCount: 0,
    stockQuantity: 40,
    isNew: false,
    isOnSale: true,
    variants: [{ size: 'M' }, { size: 'L' }],
  },
  {
    id: 9,
    name: 'Bookshelf',
    image: 'https://picsum.photos/id/1062/300/200',
    images: ['https://picsum.photos/id/1062/600/400'],
    price: '$199.99',
    category: 'Furniture',
    description: 'Spacious bookshelf for home or office.',
    rating: 0,
    reviewCount: 0,
    stockQuantity: 25,
    isNew: false,
    isOnSale: false,
  },
  {
    id: 10,
    name: 'Smart Watch',
    image: 'https://picsum.photos/id/1074/300/200',
    images: ['https://picsum.photos/id/1074/600/400'],
    price: '$249.99',
    category: 'Electronics',
    description: 'Smart watch with fitness tracking features.',
    rating: 0,
    reviewCount: 0,
    stockQuantity: 60,
    isNew: true,
    isOnSale: false,
    variants: [{ color: 'Black' }, { color: 'Silver' }],
  },
];