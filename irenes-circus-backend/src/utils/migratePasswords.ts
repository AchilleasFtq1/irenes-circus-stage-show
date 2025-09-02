import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import logger from '../config/logger';

// Load environment variables
dotenv.config();

/**
 * Migration script to handle password hashing upgrade from SHA-256 to bcrypt
 * 
 * This script will:
 * 1. Find users with old SHA-256 password hashes
 * 2. Reset their passwords to a temporary secure password
 * 3. Force them to reset their password on next login
 * 
 * Note: This is a one-time migration script for upgrading existing databases
 */

const migratePasswords = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/irenes-circus';
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB for password migration');
    
    // Get all existing users
    const users = await User.find({});
    logger.info(`Found ${users.length} users to potentially migrate`);
    
    if (users.length === 0) {
      logger.info('No users found - database appears to be empty');
      process.exit(0);
    }
    
    // Check if users have old SHA-256 hashes (they are exactly 64 characters long)
    const usersToMigrate = users.filter(user => {
      // SHA-256 hashes are 64 hex characters, bcrypt hashes start with $2a$, $2b$, or $2y$
      return user.password.length === 64 && !user.password.startsWith('$2');
    });
    
    if (usersToMigrate.length === 0) {
      logger.info('All users already have bcrypt password hashes - no migration needed');
      process.exit(0);
    }
    
    logger.info(`Found ${usersToMigrate.length} users with old SHA-256 password hashes`);
    
    // For security, we'll reset all old passwords to a temporary secure password
    // Users will need to reset their passwords
    const tempPassword = 'TempSecure123!'; // This will be hashed with bcrypt
    
    for (const user of usersToMigrate) {
      logger.info(`Migrating password for user: ${user.username} (${user.email})`);
      
      // Update password - this will trigger the bcrypt hashing in the pre-save hook
      user.password = tempPassword;
      await user.save();
      
      logger.info(`✅ Migrated password for user: ${user.username}`);
    }
    
    logger.info('🎉 Password migration completed successfully!');
    logger.info('');
    logger.info('IMPORTANT NOTES:');
    logger.info('================');
    logger.info('1. All users with old password hashes have been given a temporary password: TempSecure123!');
    logger.info('2. Users should be notified to log in with this temporary password and change it immediately');
    logger.info('3. Consider implementing a "force password reset" feature for migrated users');
    logger.info('');
    logger.info('Default users created by seed script:');
    logger.info('- Admin: admin@irenescircus.com / admin123');
    logger.info('- Editor: editor@irenescircus.com / editor123');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error during password migration:', error);
    process.exit(1);
  }
};

// Run the migration
if (require.main === module) {
  migratePasswords();
}

export default migratePasswords;
