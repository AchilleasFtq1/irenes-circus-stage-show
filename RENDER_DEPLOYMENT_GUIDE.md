# Irene's Circus - Render.com Deployment Guide 🎪

This guide walks you through deploying the Irene's Circus application to Render.com with full database setup and seeding.

## Prerequisites

1. **Render.com Account**: Sign up at [render.com](https://render.com)
2. **Node.js 18+**: Required for local development and CLI
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
4. **Render CLI**: Install with `npm install -g @render/cli`

## Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
# Run the automated deployment script
./deploy-render.sh
```

The script will:
- ✅ Check prerequisites
- ✅ Install dependencies and run tests
- ✅ Validate configuration
- ✅ Deploy to Render.com
- ✅ Provide post-deployment instructions

### Option 2: Manual Deployment

1. **Fork/Clone Repository**: Ensure your code is in a Git repository connected to Render

2. **Deploy via Render Dashboard**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your repository
   - Select the `render.yaml` file
   - Click "Apply"

## What Gets Deployed

### 🌐 Frontend Service
- **URL**: `https://irenes-circus-frontend.onrender.com`
- **Type**: Static Site
- **Build**: Vite production build
- **Features**: React Router, responsive design

### 🚀 Backend API Service
- **URL**: `https://irenes-circus-backend.onrender.com`
- **Type**: Web Service
- **Build**: TypeScript → JavaScript compilation
- **Health Check**: `/api/health`
- **Features**: Express.js, JWT auth, rate limiting

### 🗄️ MongoDB Database
- **Type**: Private Service (Docker container)
- **Image**: MongoDB 8.0
- **Storage**: 10GB persistent disk
- **Initialization**: Auto-creates indexes and collections

### 🌱 Database Seeding Job
- **Type**: One-time job
- **Purpose**: Populates database with sample data
- **Includes**: Tracks, events, band members, gallery images, admin users

## Environment Variables

### Payment Configuration

#### Stripe Setup
1. Create a [Stripe](https://stripe.com) account
2. Get your API keys from the Stripe dashboard
3. Set up webhook endpoint: `https://your-backend-url/api/webhooks/stripe`
4. Configure webhook to listen for `checkout.session.completed` events

#### PayPal Setup  
1. Create a [PayPal Developer](https://developer.paypal.com) account
2. Create an app to get Client ID and Secret
3. Use sandbox for testing, switch to live for production

### Backend Service

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `10000` |
| `MONGODB_URI` | Database connection | Auto-configured |
| `JWT_SECRET` | JWT signing key | Generate 32+ chars |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `FRONTEND_URL` | CORS origin | Auto-configured |
| `SPOTIFY_CLIENT_ID` | Spotify API | Optional |
| `SPOTIFY_CLIENT_SECRET` | Spotify API | Optional |

### Frontend Service

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend URL | Auto-configured |
| `NODE_ENV` | Environment | `production` |

## Post-Deployment Setup

### 1. 🔐 Security Configuration

**CRITICAL**: Update these immediately after deployment:

```bash
# In Render Dashboard → Backend Service → Environment
JWT_SECRET=your-super-secure-32-character-minimum-secret-key-here
```

### 2. 👥 Default User Accounts

The seeding process creates default accounts:

- **Admin**: `admin@irenescircus.com` / `admin123`
- **Editor**: `editor@irenescircus.com` / `editor123`

**⚠️ SECURITY WARNING**: Change these passwords immediately!

### 3. 🔍 Verify Deployment

1. **Frontend**: Visit your frontend URL
2. **Backend Health**: Check `/api/health` endpoint
3. **Database**: Login to admin panel and verify data
4. **API Endpoints**: Test key functionality

### 4. 🎵 Optional: Spotify Integration

If using Spotify features:

1. Create a Spotify App at [developer.spotify.com](https://developer.spotify.com)
2. Add your Render URLs to redirect URIs
3. Set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in backend environment

## Service URLs

After deployment, your services will be available at:

- **Frontend**: `https://irenes-circus-frontend.onrender.com`
- **Backend API**: `https://irenes-circus-backend.onrender.com`
- **Health Check**: `https://irenes-circus-backend.onrender.com/api/health`

## Database Schema

The application creates these collections:

- **users**: Admin and user accounts
- **tracks**: Music tracks with metadata
- **events**: Concert/show events
- **bandmembers**: Band member profiles
- **galleryimages**: Photo gallery
- **contacts**: Contact form submissions

## Monitoring & Maintenance

### 📊 Render Dashboard

Monitor your services at [dashboard.render.com](https://dashboard.render.com):

- Service health and uptime
- Resource usage
- Deployment logs
- Environment variables

### 📝 Logs

Access logs for debugging:
- Backend: Service → Logs tab
- Database: MongoDB service logs
- Build: Deploy logs for each service

### 🔄 Updates

To update your application:

1. Push changes to your Git repository
2. Render automatically rebuilds and deploys
3. Monitor deployment in dashboard

### 🚨 Alerts

Set up alerts in Render Dashboard:
- Service downtime
- High resource usage
- Failed deployments

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify package.json scripts
   - Check build logs for errors

2. **Database Connection Issues**
   - Verify MONGODB_URI is set correctly
   - Check MongoDB service is running
   - Review database service logs

3. **CORS Errors**
   - Ensure FRONTEND_URL is set correctly
   - Check frontend is accessing correct API URL
   - Verify environment variables

4. **Authentication Issues**
   - Check JWT_SECRET is set and secure
   - Verify user accounts exist in database
   - Test login endpoints directly

### Getting Help

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Support**: Render Dashboard → Help
- **Community**: Render Discord/Forum

## Custom Domain (Optional)

To use your own domain:

1. Go to Render Dashboard → Frontend Service → Settings
2. Add your custom domain
3. Configure DNS records as instructed
4. Update CORS settings in backend if needed

## Backup Strategy

Render provides automatic backups for database services. For additional protection:

1. Set up periodic database exports
2. Store critical data in external storage
3. Document your configuration

## Cost Optimization

- **Free Tier**: Suitable for development/testing
- **Starter Plan**: Recommended for production
- **Scale Up**: Monitor usage and upgrade as needed

## Security Checklist

- [ ] Changed default admin passwords
- [ ] Set secure JWT_SECRET (32+ characters)
- [ ] Enabled HTTPS (automatic on Render)
- [ ] Configured proper CORS origins
- [ ] Removed development credentials
- [ ] Set up monitoring and alerts
- [ ] Regular security updates

## Performance Tips

1. **Frontend**:
   - Images are optimized and lazy-loaded
   - Static assets cached by CDN
   - React components optimized

2. **Backend**:
   - Database queries indexed
   - Rate limiting enabled
   - Security middleware active

3. **Database**:
   - Indexes created automatically
   - Connection pooling enabled
   - Monitoring available

---

## 🎉 Congratulations!

Your Irene's Circus application is now live on Render.com! 

Visit your frontend URL to see the magic happen. Don't forget to:
- Change default passwords
- Configure monitoring
- Set up custom domain (optional)
- Share your amazing circus with the world! 🎪✨

For questions or issues, refer to the troubleshooting section or contact Render support.

**Happy performing!** 🎭🎪
