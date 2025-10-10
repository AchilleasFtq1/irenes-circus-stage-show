import mongoose from 'mongoose';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/irenes-circus';
    // Disable TLS unless connecting to an Atlas SRV URI or explicitly enabled
    const useTLS = mongoURI.startsWith('mongodb+srv://') || process.env.MONGO_TLS === 'true';
    const connectOptions: mongoose.ConnectOptions = {};
    if (!useTLS) {
      // Node MongoDB driver uses `tls`; ensure we don't attempt an SSL/TLS handshake against non-TLS servers
      (connectOptions as any).tls = false;
    }
    await mongoose.connect(mongoURI, connectOptions);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB; 