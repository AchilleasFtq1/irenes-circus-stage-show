import mongoose from 'mongoose';

export interface ITrack {
  title: string;
  duration: string;
  audioSrc: string;
  albumArt: string;
}

const trackSchema = new mongoose.Schema<ITrack>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  audioSrc: {
    type: String,
    required: true,
    trim: true
  },
  albumArt: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ITrack>('Track', trackSchema); 