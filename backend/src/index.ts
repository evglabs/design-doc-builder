import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { initializeDatabase } from './database/connection';
import { loadEnvironment } from './utils/constants';

const env = loadEnvironment();

// Initialize database first, before importing routes
initializeDatabase(env);

// Now import routes after database is initialized
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
}));

// Trust proxy headers when behind reverse proxy
app.set('trust proxy', true);

// CORS configuration
app.use(cors({
  origin: env.NODE_ENV === 'production' 
    ? true // Allow all origins in production when behind reverse proxy
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' }
});

app.use('/api/', limiter);

// Special rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true,
  message: { success: false, error: 'Too many authentication attempts, please try again later.' }
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Handle 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'API endpoint not found' 
  });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server
const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

export default app;
