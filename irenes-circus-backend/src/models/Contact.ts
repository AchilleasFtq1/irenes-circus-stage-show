import mongoose from 'mongoose';

export interface IContact {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
}

const contactSchema = new mongoose.Schema<IContact>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IContact>('Contact', contactSchema); 