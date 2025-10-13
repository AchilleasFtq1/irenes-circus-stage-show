// Types for the frontend application

export interface ITrack {
  _id: string;
  title: string;
  duration: string;
  audioSrc: string;
  albumArt: string;
}

export interface IEvent {
  _id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketLink?: string;
  isSoldOut?: boolean;
}

export interface IBandMember {
  _id: string;
  name: string;
  instrument: string;
  bio: string;
  image: string;
}

export type SpanType = 'col' | 'row' | 'both' | undefined;

export interface IGalleryImage {
  _id: string;
  src: string;
  alt: string;
  eventId?: string;
  span?: SpanType;
  data?: string; // base64 image data (optional)
  mimetype?: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
}

export interface IContact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | string;
}

export interface ApiError {
  message: string;
  error?: string | Record<string, unknown>;
} 

// Merch
export interface IProductImage {
  url: string;
  alt?: string;
}

export interface IProductVariant {
  name: string;
  value: string;
}

export interface IProduct {
  _id: string;
  title: string;
  description?: string;
  priceCents: number;
  currency: string;
  images: IProductImage[];
  sku?: string;
  slug: string;
  inventoryCount: number;
  active: boolean;
  variants?: IProductVariant[];
}

export interface IOrderItem {
  productId: string;
  title: string;
  priceCents: number;
  quantity: number;
  sku?: string;
  variant?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded';

export interface IShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  email: string;
}

export interface IOrder {
  _id: string;
  items: IOrderItem[];
  currency: string;
  subtotalCents: number;
  taxCents?: number;
  shippingCents?: number;
  totalCents: number;
  status: OrderStatus;
  shippingAddress?: IShippingAddress;
  createdAt?: string;
}