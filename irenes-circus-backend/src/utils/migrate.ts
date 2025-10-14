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
      
      // Create indexes one by one, ignoring if they already exist
      try {
        await productsCollection.createIndex({ slug: 1 }, { unique: true });
        console.log('Created slug index');
      } catch (err: any) {
        if (err.code !== 85) throw err; // 85 = IndexOptionsConflict
        console.log('Slug index already exists');
      }
      
      try {
        await productsCollection.createIndex({ sku: 1 });
        console.log('Created sku index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('SKU index already exists');
      }
      
      try {
        await productsCollection.createIndex({ active: 1 });
        console.log('Created active index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('Active index already exists');
      }
      
      // For text indexes, we need to check if any text index exists first
      const indexes = await productsCollection.indexes();
      const hasTextIndex = indexes.some(idx => idx.key && idx.key._fts === 'text');
      
      if (!hasTextIndex) {
        await productsCollection.createIndex({ title: 'text', description: 'text', sku: 'text' });
        console.log('Created text index');
      } else {
        console.log('Text index already exists');
      }
      
      // Create indexes for orders
      const ordersCollection = db.collection('orders');
      
      try {
        await ordersCollection.createIndex({ status: 1, createdAt: -1 });
        console.log('Created status-date index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('Status-date index already exists');
      }
      
      try {
        await ordersCollection.createIndex({ stripePaymentIntentId: 1 });
        console.log('Created stripe payment intent index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('Stripe payment intent index already exists');
      }
      
      try {
        await ordersCollection.createIndex({ stripeCheckoutSessionId: 1 });
        console.log('Created stripe checkout session index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('Stripe checkout session index already exists');
      }
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
      
      try {
        await uploadsCollection.createIndex({ filename: 1 }, { unique: true });
        console.log('Created filename index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('Filename index already exists');
      }
      
      try {
        await uploadsCollection.createIndex({ createdAt: -1 });
        console.log('Created createdAt index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('CreatedAt index already exists');
      }
    }
  },
  {
    name: '004_add_user_indexes',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      const usersCollection = db.collection('users');
      
      // Create unique indexes
      try {
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        console.log('Created email index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('Email index already exists');
      }
      
      try {
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        console.log('Created username index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('Username index already exists');
      }
    }
  },
  {
    name: '005_add_event_indexes',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      const eventsCollection = db.collection('events');
      
      // Create indexes for common queries
      try {
        await eventsCollection.createIndex({ date: 1 });
        console.log('Created date index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('Date index already exists');
      }
      
      try {
        await eventsCollection.createIndex({ isSoldOut: 1 });
        console.log('Created isSoldOut index');
      } catch (err: any) {
        if (err.code !== 85) throw err;
        console.log('IsSoldOut index already exists');
      }
    }
  },
  {
    name: '006_add_category_and_indexes',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      const products = db.collection('products');
      try { await products.updateMany({ category: { $exists: false } }, { $set: { category: '' } }); } catch {}
      try { await products.createIndex({ category: 1 }); console.log('Created category index'); }
      catch (err: any) { if (err.code !== 85) throw err; console.log('Category index already exists'); }
    }
  },
  {
    name: '007_create_promotions_and_giftcards',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      for (const name of ['promotions','giftcards']) {
        const exists = await db.listCollections({ name }).hasNext();
        if (!exists) { await db.createCollection(name); console.log(`Created collection: ${name}`); }
      }
      const gift = db.collection('giftcards');
      try { await gift.createIndex({ code: 1 }, { unique: true }); } catch (e: any) { if (e.code !== 85) throw e; }
    }
  },
  {
    name: '008_update_orders_tracking_and_giftcard_fields',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      const orders = db.collection('orders');
      await orders.updateMany({ trackingNumber: { $exists: false } }, { $set: { trackingNumber: '' } });
      await orders.updateMany({ giftCardCode: { $exists: false } }, { $set: { giftCardCode: '' } });
      await orders.updateMany({ giftCardAppliedCents: { $exists: false } }, { $set: { giftCardAppliedCents: 0 } });
      await orders.updateMany({ contactEmail: { $exists: false } }, { $set: { contactEmail: '' } });
      await orders.updateMany({ contactName: { $exists: false } }, { $set: { contactName: '' } });
    }
  },
  {
    name: '009_add_phone_to_shipping_address',
    up: async () => {
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');
      const orders = db.collection('orders');
      
      // Update all orders that have shippingAddress but no phone
      const result = await orders.updateMany(
        { 
          shippingAddress: { $exists: true },
          'shippingAddress.phone': { $exists: false }
        },
        { 
          $set: { 'shippingAddress.phone': null }
        }
      );
      
      console.log(`Updated ${result.modifiedCount} orders with phone field in shippingAddress`);
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
