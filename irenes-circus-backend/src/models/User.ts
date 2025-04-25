import mongoose from 'mongoose';
import crypto from 'crypto';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
  comparePassword(candidatePassword: string): boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor'
  }
}, {
  timestamps: true
});

// Simple password hashing - in production, use a proper library like bcrypt
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = crypto
    .createHash('sha256')
    .update(this.password)
    .digest('hex');
  
  next();
});

userSchema.methods.comparePassword = function(candidatePassword: string): boolean {
  const hashedPassword = crypto
    .createHash('sha256')
    .update(candidatePassword)
    .digest('hex');
    
  return this.password === hashedPassword;
};

export default mongoose.model<IUser>('User', userSchema); 