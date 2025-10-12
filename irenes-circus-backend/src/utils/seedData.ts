import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Track from '../models/Track';
import Event from '../models/Event';
import BandMember from '../models/BandMember';
import GalleryImage from '../models/GalleryImage';
import User from '../models/User';
import logger from '../config/logger';

// Sample data
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

// Connect to MongoDB
dotenv.config();

const seedDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/irenes-circus';
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB for seeding');
    
    // Clear existing data
    await Track.deleteMany({});
    await Event.deleteMany({});
    await BandMember.deleteMany({});
    await GalleryImage.deleteMany({});
    
    // Clear existing users to ensure fresh start with new password hashing
    await User.deleteMany({});
    
    logger.info('Cleared existing collections including users (due to password hashing upgrade)');
    
    // Seed data
    await Track.insertMany(tracks);
    const createdEvents = await Event.insertMany(events);
    await BandMember.insertMany(bandMembers);
    // Attach eventId to gallery images, cycling through created events
    const galleryWithEvents = galleryImages.map((img, idx) => {
      const ev = createdEvents[idx % createdEvents.length];
      return { ...img, eventId: ev?._id?.toString() };
    });
    await GalleryImage.insertMany(galleryWithEvents);
    
    // Create default admin user with bcrypt hashing
    logger.info('Creating default admin user with new bcrypt password hashing...');
    await User.create({
      username: 'admin',
      email: 'admin@irenescircus.com',
      password: 'admin123', // This will be hashed by the model's pre-save hook using bcrypt
      role: 'admin'
    });
    logger.info('Created default admin user - Email: admin@irenescircus.com, Password: admin123');
    
    // Create a sample editor user as well
    await User.create({
      username: 'editor',
      email: 'editor@irenescircus.com',
      password: 'editor123', // This will be hashed by the model's pre-save hook using bcrypt
      role: 'editor'
    });
    logger.info('Created sample editor user - Email: editor@irenescircus.com, Password: editor123');
    
    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB(); 