import mongoose from 'mongoose';

export type SpanType = 'col' | 'row' | 'both' | undefined;

export interface IGalleryImage {
  _id?: string;
  src: string;
  alt: string;
  eventId?: string;
  span?: SpanType;
}

const galleryImageSchema = new mongoose.Schema<IGalleryImage>({
  src: {
    type: String,
    required: true,
    trim: true
  },
  alt: {
    type: String,
    required: true,
    trim: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: false
  },
  span: {
    type: String,
    enum: ['col', 'row', 'both'],
    default: undefined
  }
}, {
  timestamps: true
});

export default mongoose.model<IGalleryImage>('GalleryImage', galleryImageSchema); 