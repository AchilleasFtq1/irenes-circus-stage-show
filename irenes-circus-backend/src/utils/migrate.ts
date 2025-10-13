import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../config/logger';

// Load environment variables
dotenv.config();

interface Migration {
  name: string;
  up: () => Promise<void>;
  down?: () => Promise<void>;
}

const migrations: Migration[] = [
  {
    name: '001_create_base_collections',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      
      // Create collections if they don't exist
      const collections = ['users', 'tracks', 'events', 'bandmembers', 'galleryimages', 'contacts'];
      
      for (const collectionName of collections) {
        const exists = await db.listCollections({ name: collectionName }).hasNext();
        if (!exists) {
          await db.createCollection(collectionName);
          console.log(`Created collection: ${collectionName}`);
        }
      }
    }
  },
  {
    name: '002_create_ecommerce_collections',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      
      // Create ecommerce collections
      const collections = ['products', 'orders'];
      
      for (const collectionName of collections) {
        const exists = await db.listCollections({ name: collectionName }).hasNext();
        if (!exists) {
          await db.createCollection(collectionName);
          console.log(`Created collection: ${collectionName}`);
        }
      }
      
      // Create indexes for products
      const productsCollection = db.collection('products');
      await productsCollection.createIndex({ slug: 1 }, { unique: true });
      await productsCollection.createIndex({ sku: 1 });
      await productsCollection.createIndex({ active: 1 });
      await productsCollection.createIndex({ title: 'text', description: 'text' });
      console.log('Created product indexes');
      
      // Create indexes for orders
      const ordersCollection = db.collection('orders');
      await ordersCollection.createIndex({ status: 1, createdAt: -1 });
      await ordersCollection.createIndex({ stripePaymentIntentId: 1 });
      await ordersCollection.createIndex({ stripeCheckoutSessionId: 1 });
      console.log('Created order indexes');
    }
  },
  {
    name: '003_create_upload_collection',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      
      const exists = await db.listCollections({ name: 'uploads' }).hasNext();
      if (!exists) {
        await db.createCollection('uploads');
        console.log('Created collection: uploads');
      }
      
      // Create indexes
      const uploadsCollection = db.collection('uploads');
      await uploadsCollection.createIndex({ filename: 1 }, { unique: true });
      await uploadsCollection.createIndex({ uploadDate: -1 });
      console.log('Created upload indexes');
    }
  },
  {
    name: '004_add_user_indexes',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      const usersCollection = db.collection('users');
      
      // Create unique indexes
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      await usersCollection.createIndex({ username: 1 }, { unique: true });
      console.log('Created user indexes');
    }
  },
  {
    name: '005_add_event_indexes',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      const eventsCollection = db.collection('events');
      
      // Create indexes for common queries
      await eventsCollection.createIndex({ date: 1 });
      await eventsCollection.createIndex({ isSoldOut: 1 });
      console.log('Created event indexes');
    }
  }
];

// Migration runner
class MigrationRunner {
  private db: mongoose.Connection | null = null;
  private migrationsCollection: any = null;
  
  async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      this.db = mongoose.connection;
      
      // Ensure migrations collection exists
      const dbInstance = this.db?.db;
      if (!dbInstance) throw new Error('Database instance not available');
      
      const exists = await dbInstance.listCollections({ name: 'migrations' }).hasNext();
      if (!exists) {
        await dbInstance.createCollection('migrations');
      }
      
      this.migrationsCollection = dbInstance.collection('migrations');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }
  
  async getAppliedMigrations(): Promise<string[]> {
    if (!this.migrationsCollection) return [];
    const applied = await this.migrationsCollection.find({}).toArray();
    return applied.map((m: any) => m.name);
  }
  
  async markAsApplied(name: string) {
    if (!this.migrationsCollection) throw new Error('Migrations collection not initialized');
    await this.migrationsCollection.insertOne({
      name,
      appliedAt: new Date()
    });
  }
  
  async runMigrations() {
    const appliedMigrations = await this.getAppliedMigrations();
    
    for (const migration of migrations) {
      if (!appliedMigrations.includes(migration.name)) {
        console.log(`Running migration: ${migration.name}`);
        try {
          await migration.up();
          await this.markAsApplied(migration.name);
          console.log(`✓ Migration ${migration.name} completed`);
        } catch (error) {
          console.error(`✗ Migration ${migration.name} failed:`, error);
          throw error;
        }
      } else {
        console.log(`✓ Migration ${migration.name} already applied`);
      }
    }
  }
  
  async close() {
    if (this.db) {
      await this.db.close();
      console.log('Database connection closed');
    }
  }
}

// Run migrations
const runMigrations = async () => {
  const runner = new MigrationRunner();
  
  try {
    await runner.connect();
    await runner.runMigrations();
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await runner.close();
  }
};

// Execute if run directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations, migrations };
