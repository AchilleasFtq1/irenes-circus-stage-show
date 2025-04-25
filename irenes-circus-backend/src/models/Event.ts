import mongoose from 'mongoose';

export interface IEvent {
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketLink?: string;
  isSoldOut?: boolean;
}

const eventSchema = new mongoose.Schema<IEvent>({
  date: {
    type: String,
    required: true,
    trim: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  ticketLink: {
    type: String,
    trim: true
  },
  isSoldOut: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IEvent>('Event', eventSchema); 