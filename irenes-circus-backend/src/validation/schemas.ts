import { z } from 'zod';

export const trackCreateSchema = z.object({
  title: z.string(),
  duration: z.string(),
  audioSrc: z.string(),
  albumArt: z.string()
});

export const trackUpdateSchema = trackCreateSchema.partial();

export const eventCreateSchema = z.object({
  date: z.string(),
  venue: z.string(),
  city: z.string(),
  country: z.string(),
  ticketLink: z.string().optional(),
  isSoldOut: z.boolean().optional()
});

export const eventUpdateSchema = eventCreateSchema.partial();

export const contactCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string()
});

export const bandMemberCreateSchema = z.object({
  name: z.string(),
  instrument: z.string(),
  bio: z.string(),
  image: z.string()
});

export const bandMemberUpdateSchema = bandMemberCreateSchema.partial();

export const galleryImageCreateSchema = z.object({
  src: z.string(),
  alt: z.string(),
  span: z.enum(['col', 'row', 'both']).optional()
});

export const galleryImageUpdateSchema = galleryImageCreateSchema.partial();
