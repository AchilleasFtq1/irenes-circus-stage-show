import mongoose from 'mongoose';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/irenes-circus';
    
    // Log connection attempt (mask password)
    const maskedURI = mongoURI.replace(/:([^@]+)@/, ':****@');
    console.log(`Connecting to MongoDB: ${maskedURI}`);
    logger.info(`Connecting to MongoDB: ${maskedURI}`);
    
    // Disable TLS unless connecting to an Atlas SRV URI or explicitly enabled
    const useTLS = mongoURI.startsWith('mongodb+srv://') || process.env.MONGO_TLS === 'true';
    const connectOptions: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
      socketTimeoutMS: 45000,
    };
    
    if (!useTLS) {
      // Explicitly disable TLS for non-Atlas connections
      (connectOptions as any).tls = false;
      (connectOptions as any).ssl = false;
      console.log('TLS/SSL disabled for MongoDB connection');
      logger.info('TLS/SSL disabled for MongoDB connection');
    }
    
    await mongoose.connect(mongoURI, connectOptions);
    console.log('✅ MongoDB connected successfully');
    logger.info('MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    logger.error('MongoDB connection error:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      if ('code' in error) console.error('Error code:', (error as any).code);
    }
    
    process.exit(1);
  }
};

export default connectDB; 