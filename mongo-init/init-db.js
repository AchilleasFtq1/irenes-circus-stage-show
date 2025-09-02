// MongoDB initialization script for Irene's Circus
// This script runs when the MongoDB container starts for the first time

// Switch to the irenes-circus database
db = db.getSiblingDB('irenes-circus');

// Create a user for the application (optional, since we're using root credentials)
db.createUser({
  user: 'irenes-circus-user',
  pwd: 'circus-password-123',
  roles: [
    {
      role: 'readWrite',
      db: 'irenes-circus'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.tracks.createIndex({ "title": 1 });
db.events.createIndex({ "date": 1 });
db.bandmembers.createIndex({ "name": 1 });
db.contacts.createIndex({ "createdAt": -1 });
db.contacts.createIndex({ "isRead": 1 });

print('✅ Database initialized successfully for Irenes Circus!');
