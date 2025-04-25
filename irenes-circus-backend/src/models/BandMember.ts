import mongoose from 'mongoose';

export interface IBandMember {
  name: string;
  instrument: string;
  bio: string;
  image: string;
}

const bandMemberSchema = new mongoose.Schema<IBandMember>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  instrument: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IBandMember>('BandMember', bandMemberSchema); 