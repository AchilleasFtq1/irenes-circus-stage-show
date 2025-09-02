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
  span?: SpanType;
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