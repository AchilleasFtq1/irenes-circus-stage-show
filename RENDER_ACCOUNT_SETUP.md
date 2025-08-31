# 🎪 Render.com Account Setup & Environment Variables Guide

## 1. 🔐 Render Account Setup

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your email or GitHub account
4. Verify your email address

### Step 2: Connect Your Repository
1. In Render Dashboard, click **"New"** → **"Blueprint"**
2. Connect your GitHub/GitLab account
3. Select your `irenes-circus-stage-show` repository
4. Grant necessary permissions

## 2. 🔧 Environment Variables Setup

### Where to Set Environment Variables

**For each service, you'll set environment variables in:**
1. Render Dashboard → Your Service → **Environment** tab
2. Add each variable manually with **Key** and **Value**

### 🚀 Backend Service Environment Variables

**Service Name:** `irenes-circus-backend`

| Key | Value | Notes |
|-----|-------|-------|
| `JWT_SECRET` | `your-secure-32-char-secret-key-here` | **⚠️ CRITICAL: Generate a secure 32+ character string** |
| `MONGO_INITDB_ROOT_PASSWORD` | `your-mongodb-password` | **Choose a strong password for MongoDB** |
| `SPOTIFY_CLIENT_ID` | `your_spotify_client_id` | Optional: Only if using Spotify features |
| `SPOTIFY_CLIENT_SECRET` | `your_spotify_secret` | Optional: Only if using Spotify features |

### 🗄️ MongoDB Service Environment Variables

**Service Name:** `irenes-circus-mongodb`

| Key | Value | Notes |
|-----|-------|-------|
| `MONGO_INITDB_ROOT_PASSWORD` | `same-as-backend-password` | **Must match the backend password** |

### 🌐 Frontend Service Environment Variables

**Service Name:** `irenes-circus-frontend`

The frontend environment variables are automatically configured by Render, no manual setup needed!

## 3. 📋 Step-by-Step Environment Setup

### Step 1: Generate JWT Secret
```bash
# Generate a secure JWT secret (run this locally)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and use it as your `JWT_SECRET`.

### Step 2: Choose MongoDB Password
Create a strong password for MongoDB (e.g., `MySecureMongoPass123!`)

### Step 3: Set Backend Environment Variables
1. Go to Render Dashboard
2. Click on **"irenes-circus-backend"** service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add these variables:

```
Key: JWT_SECRET
Value: [your-generated-secret-from-step-1]

Key: MONGO_INITDB_ROOT_PASSWORD  
Value: [your-mongodb-password-from-step-2]
```

### Step 4: Set MongoDB Environment Variables
1. Go to Render Dashboard
2. Click on **"irenes-circus-mongodb"** service
3. Go to **"Environment"** tab
4. Add this variable:

```
Key: MONGO_INITDB_ROOT_PASSWORD
Value: [same-password-as-backend]
```

### Step 5: Optional Spotify Setup
If you want Spotify integration:

1. Go to [developer.spotify.com](https://developer.spotify.com)
2. Create a new app
3. Get your Client ID and Client Secret
4. Add to backend environment variables:

```
Key: SPOTIFY_CLIENT_ID
Value: [your-spotify-client-id]

Key: SPOTIFY_CLIENT_SECRET
Value: [your-spotify-client-secret]
```

## 4. 🚀 Deployment Process

### Option 1: Automatic Deployment (Recommended)
```bash
# Run the deployment script
./deploy-render.sh
```

### Option 2: Manual Deployment
1. Push your code to GitHub/GitLab
2. In Render Dashboard: **New** → **Blueprint**
3. Select your repository
4. Choose `render.yaml`
5. Click **"Apply"**

## 5. ⚙️ Hobby Plan Limitations & Optimizations

### What's Included in Free/Hobby Plan:
- ✅ 750 hours/month compute time
- ✅ 100GB bandwidth/month
- ✅ Custom domains
- ✅ Automatic HTTPS
- ✅ Git-based deploys

### Limitations:
- 💤 Services sleep after 15 minutes of inactivity
- 🐌 Cold start delays (30-60 seconds)
- 📊 Limited resources per service

### Optimizations for Hobby Plan:
- Keep services active with uptime monitoring (optional)
- Optimize build times to reduce deployment duration
- Use efficient database queries
- Minimize cold start impact with health checks

## 6. 🔍 Environment Variables Reference

### Auto-Configured Variables (Don't Set These)
These are automatically set by Render:

| Variable | Description | Auto-Set Value |
|----------|-------------|----------------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `10000` |
| `MONGODB_URI` | Database URL | `mongodb://admin:${MONGO_PASSWORD}@irenes-circus-mongodb:27017/irenes-circus` |
| `FRONTEND_URL` | CORS origin | `https://irenes-circus-frontend.onrender.com` |
| `VITE_API_URL` | Frontend API URL | `https://irenes-circus-backend.onrender.com` |

### Manual Variables (You Must Set These)

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ **YES** | JWT signing key (32+ chars) |
| `MONGO_INITDB_ROOT_PASSWORD` | ✅ **YES** | MongoDB admin password |
| `SPOTIFY_CLIENT_ID` | ❌ Optional | Spotify API client ID |
| `SPOTIFY_CLIENT_SECRET` | ❌ Optional | Spotify API client secret |

## 7. 🔒 Security Best Practices

### JWT Secret
- ✅ **Minimum 32 characters**
- ✅ Use random characters (letters, numbers, symbols)
- ❌ Don't use dictionary words
- ❌ Don't commit to version control

### MongoDB Password
- ✅ **Minimum 12 characters**
- ✅ Mix of uppercase, lowercase, numbers, symbols
- ❌ Don't use common passwords
- ❌ Don't reuse passwords from other services

### Example Secure Values
```bash
# Good JWT Secret (32+ chars, random)
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c89b7e8f8

# Good MongoDB Password
MONGO_INITDB_ROOT_PASSWORD=MyApp2024!SecureDB#Pass
```

## 8. 🧪 Testing Your Setup

### After Deployment, Test These URLs:
- **Frontend**: `https://irenes-circus-frontend.onrender.com`
- **Backend Health**: `https://irenes-circus-backend.onrender.com/api/health`
- **API Test**: `https://irenes-circus-backend.onrender.com/api/`

### Expected Responses:
```json
// Health Check Response
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}

// API Root Response  
{
  "message": "Irene's Circus API",
  "version": "1.0.0",
  "status": "healthy"
}
```

## 9. 🚨 Troubleshooting

### Common Issues:

**"Service failed to start"**
- Check environment variables are set correctly
- Verify JWT_SECRET is 32+ characters
- Ensure MongoDB password matches between services

**"Database connection failed"**
- Verify MONGO_INITDB_ROOT_PASSWORD is set on both services
- Check MongoDB service is running
- Wait for MongoDB to fully initialize (can take 2-3 minutes)

**"CORS errors"**
- FRONTEND_URL should be auto-configured
- If manual setup needed, use exact frontend URL

### Getting Help:
- Check service logs in Render Dashboard
- Review environment variables in each service
- Test individual endpoints
- Contact Render support if needed

## 10. 🎉 Success Checklist

- [ ] Render account created and verified
- [ ] Repository connected to Render
- [ ] JWT_SECRET generated and set (32+ characters)
- [ ] MongoDB password chosen and set on both services
- [ ] Deployment completed successfully
- [ ] Frontend loads at your Render URL
- [ ] Backend health check responds correctly
- [ ] Database seeding completed
- [ ] Admin login works with default credentials
- [ ] **IMPORTANT**: Default passwords changed!

---

## 🎪 Ready to Go Live!

Once you've completed this setup:

1. **Run**: `./deploy-render.sh`
2. **Wait**: For all services to start (2-5 minutes)
3. **Test**: Your live application
4. **Secure**: Change default admin passwords
5. **Enjoy**: Your Irene's Circus is live! 🎭✨

**Your app will be available at:**
- **🌐 Website**: `https://irenes-circus-frontend.onrender.com`
- **🔧 API**: `https://irenes-circus-backend.onrender.com`
