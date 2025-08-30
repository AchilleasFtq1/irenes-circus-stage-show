# Password Migration Guide

## 🔒 Important: Password System Upgrade

The Irene's Circus application has been upgraded from SHA-256 to bcrypt password hashing for enhanced security. This means **existing user passwords will no longer work** and need to be updated.

## 🚨 What Changed

- **Before**: SHA-256 password hashing (insecure)
- **After**: bcrypt with 12 salt rounds (secure, industry standard)

## 📋 Migration Options

### Option 1: Fresh Database (Recommended for Development)

If you're okay with starting fresh (losing existing data):

```bash
# 1. Start MongoDB
# On macOS with Homebrew:
brew services start mongodb-community

# Or start manually:
mongod

# 2. Run the seed script (this will clear all data and create fresh users)
pnpm seed
```

**Default users created:**
- **Admin**: `admin@irenescircus.com` / `admin123`
- **Editor**: `editor@irenescircus.com` / `editor123`

### Option 2: Migrate Existing Database

If you want to keep existing data but migrate passwords:

```bash
# 1. Start MongoDB
brew services start mongodb-community

# 2. Run the password migration script
pnpm migrate:passwords
```

This will:
- Keep all existing data (tracks, events, band members, etc.)
- Reset old user passwords to: `TempSecure123!`
- Users can log in with this temporary password and should change it immediately

### Option 3: Manual Database Setup

If you prefer to set up users manually:

```bash
# 1. Start MongoDB
brew services start mongodb-community

# 2. Connect to MongoDB
mongo irenes-circus

# 3. Clear old users (optional)
db.users.deleteMany({})

# 4. The application will automatically hash any new passwords created through the registration endpoint
```

## 🔧 Environment Setup

Make sure you have the required environment variables:

**Backend `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/irenes-circus
NODE_ENV=development
LOG_LEVEL=debug

# Required for new JWT system
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Spotify API credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## 🚀 Quick Start Commands

```bash
# Install dependencies
pnpm setup

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Option A: Fresh start with sample data
pnpm seed

# Option B: Migrate existing passwords
pnpm migrate:passwords

# Start the development server
pnpm dev
```

## 🔐 Login Credentials

### After Fresh Seed (Option 1)
- **Admin**: `admin@irenescircus.com` / `admin123`
- **Editor**: `editor@irenescircus.com` / `editor123`

### After Migration (Option 2)
- **All existing users**: Use email / `TempSecure123!`
- **Recommend**: Users should change passwords immediately after login

## 🛠️ Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if not running
brew services start mongodb-community

# Or install MongoDB if not installed
brew tap mongodb/brew
brew install mongodb-community
```

### Permission Issues

```bash
# Fix MongoDB permissions (macOS)
sudo chown -R $(whoami) /usr/local/var/mongodb
sudo chown -R $(whoami) /usr/local/var/log/mongodb
```

### Port Conflicts

If port 27017 is in use:
```bash
# Find what's using the port
lsof -i :27017

# Kill the process if needed
kill -9 <PID>
```

## 📝 Important Notes

1. **Security**: The new bcrypt system is much more secure than the old SHA-256 method
2. **Performance**: bcrypt is intentionally slower to prevent brute force attacks
3. **Compatibility**: Old passwords are completely incompatible and must be reset
4. **Production**: Always use strong JWT_SECRET in production (minimum 32 characters)

## 🔄 What Happens During Migration

### Seed Script (`pnpm seed`)
1. Connects to MongoDB
2. **Clears all existing data** (tracks, events, band members, gallery, users)
3. Creates fresh sample data
4. Creates admin and editor users with bcrypt-hashed passwords

### Migration Script (`pnpm migrate:passwords`)
1. Connects to MongoDB
2. **Keeps all existing data** (tracks, events, band members, gallery)
3. Identifies users with old SHA-256 passwords (64 characters long)
4. Resets their passwords to `TempSecure123!` (bcrypt hashed)
5. Logs which users were migrated

## 🎯 Next Steps After Migration

1. **Test login** with the new credentials
2. **Change default passwords** immediately
3. **Notify users** about the password reset (if using migration option)
4. **Update documentation** with new login credentials
5. **Set up monitoring** for failed login attempts

## 📞 Support

If you encounter issues:
1. Check MongoDB is running: `brew services list | grep mongodb`
2. Check environment variables are set correctly
3. Review the logs for specific error messages
4. Try the fresh seed option if migration fails

---

**Remember**: This is a one-time migration due to the security upgrade. Once completed, the new bcrypt system will handle all future password operations securely.
