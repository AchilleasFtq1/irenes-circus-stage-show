import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Track from '../models/Track';
import Event from '../models/Event';
import BandMember from '../models/BandMember';
import GalleryImage from '../models/GalleryImage';
import User from '../models/User';
import Upload from '../models/Upload';
import logger from '../config/logger';
import https from 'https';
import http from 'http';

// Load environment variables
dotenv.config();

// Helper function to create upload from URL
const createUploadFromUrl = async (url: string, altText: string): Promise<string> => {
  try {
    // Check if already exists
    const existing = await Upload.findOne({ originalName: url });
    if (existing) {
      const baseUrl = process.env.BACKEND_PUBLIC_URL || 'http://localhost:5001';
      return `${baseUrl}/api/uploads/${existing.filename}`;
    }

    // Download image
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const base64 = buffer.toString('base64');
            const filename = `seed-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
            
            const upload = await Upload.create({
              filename,
              originalName: url,
              mimetype: 'image/jpeg',
              data: base64,
              size: buffer.length
            });
            
            const baseUrl = process.env.BACKEND_PUBLIC_URL || 'http://localhost:5001';
            resolve(`${baseUrl}/api/uploads/${upload.filename}`);
          } catch (err) {
            logger.warn(`Failed to store image ${url}, using original URL`);
            resolve(url);
          }
        });
        response.on('error', () => resolve(url));
      }).on('error', () => resolve(url));
    });
  } catch (error) {
    logger.warn(`Failed to process image ${url}, using original URL`);
    return url;
  }
};

// Sample data for production
const tracks = [
  {
    title: "Carnival of Dreams",
    duration: "3:45",
    audioSrc: "/audio/track1.mp3",
    albumArt: "https://images.unsplash.com/photo-1588479839125-3a70c4a072c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Tightrope Walker",
    duration: "4:12",
    audioSrc: "/audio/track2.mp3",
    albumArt: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "The Ringmaster",
    duration: "3:28",
    audioSrc: "/audio/track3.mp3",
    albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Fire Dancer",
    duration: "5:03",
    audioSrc: "/audio/track4.mp3",
    albumArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Acrobat's Flight",
    duration: "3:58",
    audioSrc: "/audio/track5.mp3",
    albumArt: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

const events = [
  {
    date: "2025-05-15",
    venue: "The Blue Note",
    city: "Brooklyn",
    country: "USA",
    ticketLink: "https://example.com/tickets/1",
  },
  {
    date: "2025-05-22",
    venue: "Soundwave Club",
    city: "Los Angeles",
    country: "USA",
    ticketLink: "https://example.com/tickets/2",
  },
  {
    date: "2025-06-05",
    venue: "The Roundhouse",
    city: "London",
    country: "UK",
    ticketLink: "https://example.com/tickets/3",
  },
  {
    date: "2025-06-12",
    venue: "Electric Ballroom",
    city: "Paris",
    country: "France",
    ticketLink: "https://example.com/tickets/4",
    isSoldOut: true,
  },
  {
    date: "2025-06-19",
    venue: "Circus Theatre",
    city: "Berlin",
    country: "Germany",
  }
];

const bandMembers = [
  {
    name: "Irene Castillo",
    instrument: "Lead Vocals & Guitar",
    bio: "The founder and visionary behind Irene's Circus, Irene brings her powerful vocals and creative songwriting to the forefront. With a background in theatre and music, she created the band to merge her two passions into one spectacular show.",
    image: "https://images.unsplash.com/photo-1605722243720-8d98f835dbeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Max Thornton",
    instrument: "Lead Guitar & Backing Vocals",
    bio: "A virtuoso guitarist with a flair for the dramatic, Max adds technical brilliance and theatrical energy to every performance. When not performing with the band, he composes film scores and teaches master classes.",
    image: "https://images.unsplash.com/photo-1618254170399-921fc91b1d0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Sophia Lee",
    instrument: "Bass & Synths",
    bio: "With her unique approach to the bass guitar and electronic elements, Sophia creates the foundation of the band's distinctive sound. A classically trained musician who found her home in the alternative scene.",
    image: "https://images.unsplash.com/photo-1557186841-97583421ec1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Leo Drummond",
    instrument: "Drums & Percussion",
    bio: "The rhythmic heartbeat of Irene's Circus, Leo brings a combination of precision and wild energy to every performance. His background in jazz and rock fusion gives the band's sound its unique groove.",
    image: "https://images.unsplash.com/photo-1581297848080-c4482d824e2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Irene's Circus performing on stage",
    span: "col"
  },
  {
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Concert crowd",
  },
  {
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Band backstage",
  },
  {
    src: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Promotional photoshoot",
    span: "row"
  },
  {
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Studio recording session",
  }
];

const seedProductionDB = async (): Promise<void> => {
  try {
    // Get MongoDB URI from environment
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    // Check if we're already connected to avoid double connection
    if (mongoose.connection.readyState !== 1) {
      logger.info('Connecting to MongoDB for production seeding...');
      logger.info(`MongoDB URI: ${mongoURI.replace(/\/\/.*@/, '//*****@')}`); // Log URI with password hidden
      await mongoose.connect(mongoURI);
    }
    logger.info('Connected to MongoDB for production seeding');
    
    // Check if data already exists
    const existingTracks = await Track.countDocuments();
    const existingUsers = await User.countDocuments();
    
    if (existingTracks > 0 || existingUsers > 0) {
      logger.info(`Database already contains data (${existingTracks} tracks, ${existingUsers} users). Skipping seeding to prevent duplicates.`);
      
      // But still ensure we have an admin user
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        logger.info('No admin user found. Creating default admin user...');
        await User.create({
          username: 'admin',
          email: 'admin@irenescircus.com',
          password: 'admin123',
          role: 'admin'
        });
        logger.info('Created admin user - Email: admin@irenescircus.com, Password: admin123');
      }
      
      logger.info('Production seeding completed (data already existed)');
      return;
    }
    
    logger.info('Database is empty. Proceeding with full seeding...');
    
    // Seed data
    logger.info('Seeding tracks...');
    await Track.insertMany(tracks);
    logger.info(`Seeded ${tracks.length} tracks`);
    
    logger.info('Seeding events...');
    const createdEvents = await Event.insertMany(events);
    logger.info(`Seeded ${events.length} events`);
    
    logger.info('Seeding band members...');
    await BandMember.insertMany(bandMembers);
    logger.info(`Seeded ${bandMembers.length} band members`);
    
    logger.info('Seeding gallery images...');
    // Convert image URLs to MongoDB storage
    const processedImages = await Promise.all(
      galleryImages.map(async (img, idx) => {
        const newSrc = await createUploadFromUrl(img.src, img.alt);
        const ev = createdEvents[idx % createdEvents.length];
        return { 
          ...img, 
          src: newSrc,
          eventId: ev?._id?.toString() 
        };
      })
    );
    await GalleryImage.insertMany(processedImages);
    logger.info(`Seeded ${galleryImages.length} gallery images`);
    
    // Create default admin user
    logger.info('Creating default admin user...');
    await User.create({
      username: 'admin',
      email: 'admin@irenescircus.com',
      password: 'admin123', // Will be hashed by the model's pre-save hook
      role: 'admin'
    });
    logger.info('Created admin user - Email: admin@irenescircus.com, Password: admin123');
    
    // Create a sample editor user
    logger.info('Creating sample editor user...');
    await User.create({
      username: 'editor',
      email: 'editor@irenescircus.com',
      password: 'editor123', // Will be hashed by the model's pre-save hook
      role: 'editor'
    });
    logger.info('Created editor user - Email: editor@irenescircus.com, Password: editor123');
    
    logger.info('Production database seeding completed successfully');
    logger.info('⚠️  IMPORTANT: Change default passwords immediately after deployment!');
    
  } catch (error) {
    logger.error('Error seeding production database:', error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Only run if this file is executed directly
if (require.main === module) {
  seedProductionDB()
    .then(() => {
      logger.info('Production seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Production seeding script failed:', error);
      process.exit(1);
    });
}

export default seedProductionDB;
