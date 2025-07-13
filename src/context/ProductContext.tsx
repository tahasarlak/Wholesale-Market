import { createContext } from 'react';

export interface Product {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  price: string;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  reviewCount?: number;
  stockQuantity?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  minPurchaseQuantity: number;
  maxPurchaseQuantity: number;
  sellerId: number;
  sku?: string;
  brand?: string;
  material?: string;
  dimensions?: { length: number; width: number; height: number; unit: string };
  weight?: { value: number; unit: string };
  warranty?: string;
  shippingDetails?: { shipsFrom: string; estimatedDelivery: string; shippingCost: string };
  tags?: string[];
  condition?: 'new' | 'used' | 'refurbished';
  returnPolicy?: string;
  variants?: Array<{ sku: string; color?: string; size?: string; price?: string }>;
  bulkPricing?: Array<{ minQuantity: number; price: string }>;
}

export interface Seller {
  id: number;
  name: string;
  email: string;
  businessName: string;
  whatsappNumber?: string;
  telegramUsername?: string;
  preferredCommunication: 'email' | 'whatsapp' | 'telegram';
  paymentMethods: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface PurchaseRequest {
  id: number;
  productId: number;
  sellerId: number;
  buyerId: number;
  quantity: number;
  proposedPrice?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  buyerContact: { email?: string; whatsapp?: string; telegram?: string };
}

export interface ProductContextType {
  products: Product[];
  sellers: Seller[];
  purchaseRequests: PurchaseRequest[];
  submitPurchaseRequest: (
    productId: number,
    quantity: number,
    buyerContact: { email?: string; whatsapp?: string; telegram?: string },
    proposedPrice?: string
  ) => Promise<void>;
  sendNotification: (recipientId: number, message: string, method: 'email' | 'whatsapp' | 'telegram') => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const initialProducts: Product[] = [
  
  {
    id: 2,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 20-hour battery life.',
    shortDescription: 'Premium wireless headphones',
    price: '$149.99',
    image: 'https://picsum.photos/300/200?random=1',
    images: [
      'https://picsum.photos/300/200?random=1',
      'https://picsum.photos/300/200?random=2',
      'https://picsum.photos/300/200?random=3',
    ],
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 25,
    stockQuantity: 50,
    isNew: false,
    isOnSale: true,
    minPurchaseQuantity: 1,
    maxPurchaseQuantity: 10,
    sellerId: 2,
    sku: 'WH002',
    brand: 'AudioTech',
    material: 'Aluminum, Leather',
    dimensions: { length: 18, width: 15, height: 8, unit: 'cm' },
    weight: { value: 0.3, unit: 'kg' },
    warranty: '2 years',
    shippingDetails: { shipsFrom: 'China', estimatedDelivery: '7-14 days', shippingCost: '$15' },
    tags: ['headphones', 'wireless', 'audio'],
    condition: 'new',
    returnPolicy: '14 days',
    variants: [
      { sku: 'WH002-BK', color: 'Black', price: '$149.99' },
      { sku: 'WH002-WH', color: 'White', price: '$149.99' },
    ],
    bulkPricing: [
      { minQuantity: 5, price: '$139.99' },
      { minQuantity: 10, price: '$129.99' },
    ],
  },
  {
    id: 3,
    name: 'Vintage Leather Jacket',
    description: 'Classic leather jacket made from genuine leather, perfect for casual and formal wear.',
    shortDescription: 'Stylish leather jacket',
    price: '$199.00',
    image: 'https://picsum.photos/300/200?random=4',
    images: [
      'https://picsum.photos/300/200?random=4',
      'https://picsum.photos/300/200?random=5',
    ],
    category: 'Fashion',
    rating: 4.2,
    reviewCount: 15,
    stockQuantity: 20,
    isNew: true,
    isOnSale: false,
    minPurchaseQuantity: 1,
    maxPurchaseQuantity: 5,
    sellerId: 3,
    sku: 'LJ003',
    brand: 'RetroWear',
    material: 'Genuine Leather',
    weight: { value: 1.2, unit: 'kg' },
    warranty: '6 months',
    shippingDetails: { shipsFrom: 'Italy', estimatedDelivery: '10-15 days', shippingCost: '$25' },
    tags: ['fashion', 'jacket', 'leather'],
    condition: 'new',
    returnPolicy: '30 days',
    variants: [
      { sku: 'LJ003-M', size: 'Medium', price: '$199.00' },
      { sku: 'LJ003-L', size: 'Large', price: '$199.00' },
    ],
  },
  {
    id: 4,
    name: 'Smart LED Bulb',
    description: 'Energy-efficient smart LED bulb with app control and color-changing features.',
    shortDescription: 'Smart LED bulb',
    price: '$29.99',
    image: 'https://picsum.photos/300/200?random=6',
    images: ['https://picsum.photos/300/200?random=6'],
    category: 'Home & Living',
    rating: 4.0,
    reviewCount: 8,
    stockQuantity: 200,
    isNew: true,
    isOnSale: true,
    minPurchaseQuantity: 2,
    maxPurchaseQuantity: 50,
    sellerId: 4,
    sku: 'SLB004',
    brand: 'BrightHome',
    material: 'Plastic, Glass',
    dimensions: { length: 12, width: 6, height: 6, unit: 'cm' },
    weight: { value: 0.1, unit: 'kg' },
    warranty: '1 year',
    shippingDetails: { shipsFrom: 'USA', estimatedDelivery: '3-5 days', shippingCost: '$5' },
    tags: ['smart home', 'lighting', 'LED'],
    condition: 'new',
    returnPolicy: '30 days',
    variants: [{ sku: 'SLB004-WH', color: 'White', price: '$29.99' }],
    bulkPricing: [{ minQuantity: 10, price: '$25.99' }],
  },
  {
    id: 1,
    name: 'Refurbished Laptop',
    description: 'Refurbished high-performance laptop with SSD and 16GB RAM, ideal for work and gaming.',
    shortDescription: 'Refurbished laptop',
    price: '$499.00',
    image: 'https://picsum.photos/300/200?random=7',
    images: [
      'https://picsum.photos/300/200?random=7',
      'https://picsum.photos/300/200?random=8',
      'https://picsum.photos/300/200?random=9',
    ],
    category: 'Electronics',
    rating: 4.3,
    reviewCount: 12,
    stockQuantity: 10,
    isNew: false,
    isOnSale: false,
    minPurchaseQuantity: 1,
    maxPurchaseQuantity: 3,
    sellerId: 2,
    sku: 'RL005',
    brand: 'TechTrend',
    material: 'Aluminum, Plastic',
    dimensions: { length: 35, width: 24, height: 2, unit: 'cm' },
    weight: { value: 1.8, unit: 'kg' },
    warranty: '90 days',
    shippingDetails: { shipsFrom: 'USA', estimatedDelivery: '5-7 days', shippingCost: '$20' },
    tags: ['laptop', 'refurbished', 'electronics'],
    condition: 'refurbished',
    returnPolicy: '15 days',
  },
];

export const initialSellers: Seller[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    businessName: 'Doe Enterprises',
    whatsappNumber: '+1234567890',
    telegramUsername: '@DoeEnterprises',
    preferredCommunication: 'email',
    paymentMethods: ['Bank Transfer'],
    verificationStatus: 'verified',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    businessName: 'Smith Electronics',
    whatsappNumber: '+1987654321',
    telegramUsername: '@SmithElectronics',
    preferredCommunication: 'whatsapp',
    paymentMethods: ['PayPal', 'Credit Card'],
    verificationStatus: 'verified',
  },
  {
    id: 3,
    name: 'Marco Rossi',
    email: 'marco@example.com',
    businessName: 'Rossi Fashion',
    whatsappNumber: '+393123456789',
    preferredCommunication: 'email',
    paymentMethods: ['Bank Transfer', 'PayPal'],
    verificationStatus: 'pending',
  },
  {
    id: 4,
    name: 'Emily Chen',
    email: 'emily@example.com',
    businessName: 'BrightHome Solutions',
    telegramUsername: '@BrightHome',
    preferredCommunication: 'telegram',
    paymentMethods: ['Credit Card', 'Cryptocurrency'],
    verificationStatus: 'verified',
  },
];

export const ProductContext = createContext<ProductContextType | null>(null);