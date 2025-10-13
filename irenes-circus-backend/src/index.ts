import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { handleStripeWebhook } from './controllers/paymentController';
import connectDB from './config/database';
import logger from './config/logger';
// Rate limiting imports removed
import seedProductionDB from './utils/seedProduction';
import { runMigrations } from './utils/migrate';

// Load environment variables
dotenv.config();

// Add global error handlers immediately
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});

// Log startup
console.log('Starting Irene\'s Circus Backend...');
logger.info('Starting Irene\'s Circus Backend...');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;
// Trust proxy to correctly detect protocol and host behind Render/Reverse proxies
app.set('trust proxy', 1);

// Environment validation
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  const errorMsg = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
  console.error(errorMsg);
  logger.error(errorMsg);
  process.exit(1);
}

// Log environment info (without exposing secrets)
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
  LOG_TO_CONSOLE: process.env.LOG_TO_CONSOLE,
  MONGODB_URI: process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set',
  FRONTEND_URL: process.env.FRONTEND_URL || 'Not set'
});
logger.info('Environment variables validated');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "https://js.stripe.com", "https://www.paypal.com"],
      connectSrc: ["'self'", "https://api.spotify.com", "https://api.stripe.com", "https://api-m.paypal.com", "https://api-m.sandbox.paypal.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow Spotify embeds
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
const getProductionOrigin = (): string => {
  const raw = process.env.FRONTEND_URL;
  if (!raw) return 'https://yourdomain.com';
  return raw.startsWith('http') ? raw : `https://${raw}`;
};

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? getProductionOrigin()
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

console.log('CORS origin:', process.env.NODE_ENV === 'production' ? getProductionOrigin() : 'localhost origins');
logger.info('CORS configured for origin:', process.env.NODE_ENV === 'production' ? getProductionOrigin() : 'localhost origins');

app.use(cors(corsOptions));

// Rate limiting removed

// Body parsing middleware
// Stripe webhook requires raw body to validate signatures; mount this before JSON parser
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res, next) => {
  (req as any).rawBody = req.body;
  next();
}, handleStripeWebhook as unknown as express.RequestHandler);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Uploads are now served from MongoDB via /api/uploads/:filename route
// No static file serving needed

// Request logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    logger.info('Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await connectDB();
    
    console.log('MongoDB connected, running migrations...');
    logger.info('MongoDB connected, running migrations...');
    
    // Run migrations
    try {
      await runMigrations();
      logger.info('Database migrations completed');
    } catch (migrationError) {
      logger.error('Migration failed:', migrationError);
      throw migrationError;
    }
    
    // Auto-seed database in production if empty
    if (process.env.NODE_ENV === 'production') {
      logger.info('Production environment detected. Checking if database seeding is needed...');
      try {
        await seedProductionDB();
      } catch (seedError) {
        logger.warn('Database seeding failed, but continuing with server startup:', seedError);
        console.warn('Database seeding failed:', seedError);
      }
    }
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server with error handling
startServer().catch((error) => {
  console.error('❌ Fatal startup error:', error);
  logger.error('Fatal startup error:', error);
  process.exit(1);
}); 