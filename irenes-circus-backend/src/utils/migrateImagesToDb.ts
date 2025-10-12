import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import GalleryImage from '../models/GalleryImage';
import Upload from '../models/Upload';
import logger from '../config/logger';

// Load environment variables
dotenv.config();

// Function to download image and convert to base64
const downloadImageToBase64 = (url: string): Promise<{ data: string; contentType: string; size: number }> => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      const chunks: Buffer[] = [];
      
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const contentType = response.headers['content-type'] || 'image/jpeg';
        
        resolve({
          data: base64,
          contentType,
          size: buffer.length
        });
      });
      
      response.on('error', reject);
    }).on('error', reject);
  });
};

// Function to migrate a single image URL to MongoDB
const migrateImageToDb = async (imageUrl: string, altText: string): Promise<string> => {
  try {
    // Check if this URL is already migrated
    const existingUpload = await Upload.findOne({ originalName: imageUrl });
    if (existingUpload) {
      logger.info(`Image already migrated: ${imageUrl}`);
      const baseUrl = process.env.BACKEND_PUBLIC_URL || 'http://localhost:5001';
      return `${baseUrl}/api/uploads/${existingUpload.filename}`;
    }

    // Download the image
    logger.info(`Downloading image: ${imageUrl}`);
    const { data, contentType, size } = await downloadImageToBase64(imageUrl);
    
    // Generate filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = imageUrl.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `migrated-${uniqueSuffix}.${ext}`;
    
    // Save to MongoDB
    const upload = await Upload.create({
      filename,
      originalName: imageUrl, // Store original URL for reference
      mimetype: contentType,
      data,
      size,
      uploadedBy: undefined // System migration
    });
    
    logger.info(`Migrated image to MongoDB: ${filename}`);
    
    // Return new URL
    const baseUrl = process.env.BACKEND_PUBLIC_URL || 'http://localhost:5001';
    return `${baseUrl}/api/uploads/${upload.filename}`;
  } catch (error) {
    logger.error(`Failed to migrate image ${imageUrl}:`, error);
    // Return original URL if migration fails
    return imageUrl;
  }
};

const migrateAllImages = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      logger.info('Connecting to MongoDB...');
      await mongoose.connect(mongoURI);
    }
    logger.info('Connected to MongoDB');
    
    // Get all gallery images
    const galleryImages = await GalleryImage.find({});
    logger.info(`Found ${galleryImages.length} gallery images to check`);
    
    let migratedCount = 0;
    
    for (const image of galleryImages) {
      // Check if image URL is external (http/https)
      if (image.src && (image.src.startsWith('http://') || image.src.startsWith('https://'))) {
        logger.info(`Processing: ${image.alt}`);
        
        try {
          const newUrl = await migrateImageToDb(image.src, image.alt);
          
          if (newUrl !== image.src) {
            // Update the gallery image with new URL
            image.src = newUrl;
            await image.save();
            migratedCount++;
            logger.info(`Updated gallery image: ${image.alt} -> ${newUrl}`);
          }
        } catch (error) {
          logger.error(`Failed to process image ${image._id}:`, error);
        }
      }
    }
    
    logger.info(`Migration completed. Migrated ${migratedCount} images.`);
    
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  migrateAllImages()
    .then(() => {
      logger.info('Image migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Image migration failed:', error);
      process.exit(1);
    });
}

export default migrateAllImages;
