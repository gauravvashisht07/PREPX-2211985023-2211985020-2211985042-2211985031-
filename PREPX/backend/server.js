import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import todoRoutes from './routes/todos.js';
import resumeRoutes from './routes/resume.js';
import dailyRoutes from './routes/daily.js';
import mcqRoutes from './routes/mcq.js';
import userRoutes from './routes/user.js';
import aiRoutes from './routes/ai.js';
import mockInterviewRoutes from './routes/mockInterview.js';

connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json());

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 requests per hour for sensitive routes
  message: 'Too many attempts, please try again in an hour'
});

app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/ai/', authLimiter);

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/mcq', mcqRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mock', mockInterviewRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Prepx API running' }));

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 Prepx server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
