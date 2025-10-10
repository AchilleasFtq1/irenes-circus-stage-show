import mongoose from 'mongoose';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  // Add retry logic for MongoDB connection
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/irenes-circus';
      
      // Log connection attempt (mask password)
      const maskedURI = mongoURI.replace(/:([^@]+)@/, ':****@');
      console.log(`[Attempt ${attempt}/${maxRetries}] Connecting to MongoDB: ${maskedURI}`);
      logger.info(`[Attempt ${attempt}/${maxRetries}] Connecting to MongoDB: ${maskedURI}`);
      
      // Parse the URI to check if it's using TLS
      const hasTLSParam = mongoURI.includes('tls=true') || mongoURI.includes('ssl=true');
      const useTLS = mongoURI.startsWith('mongodb+srv://') || hasTLSParam || process.env.MONGO_TLS === 'true';
      
      const connectOptions: mongoose.ConnectOptions = {
        serverSelectionTimeoutMS: 10000, // 10 seconds per attempt
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
      return; // Success, exit the function
      
    } catch (error) {
      console.error(`❌ MongoDB connection error (attempt ${attempt}/${maxRetries}):`, error);
      logger.error(`MongoDB connection error (attempt ${attempt}/${maxRetries}):`, error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if ('code' in error) console.error('Error code:', (error as any).code);
        
        // Check if it's a DNS error
        if (error.message.includes('ENOTFOUND')) {
          console.error('DNS resolution failed. MongoDB service may not be ready yet.');
          logger.error('DNS resolution failed. MongoDB service may not be ready yet.');
        }
      }
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        logger.info(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error('❌ All MongoDB connection attempts failed. Exiting.');
        logger.error('All MongoDB connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
};

export default connectDB; 