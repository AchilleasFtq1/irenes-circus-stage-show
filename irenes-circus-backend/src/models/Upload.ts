import mongoose from 'mongoose';

export interface IUpload {
  _id?: string;
  filename: string;
  originalName: string;
  mimetype: string;
  data: string; // Base64 encoded image data
  size: number;
  uploadedBy?: string; // User ID who uploaded
  createdAt?: Date;
  updatedAt?: Date;
}

const uploadSchema = new mongoose.Schema<IUpload>({
  filename: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  mimetype: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  data: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries (removed filename index as it's already created by unique: true)
uploadSchema.index({ createdAt: -1 });

export default mongoose.model<IUpload>('Upload', uploadSchema);
