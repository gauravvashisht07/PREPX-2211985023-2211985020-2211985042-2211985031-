import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import todoRoutes from './routes/todos.js';
import resumeRoutes from './routes/resume.js';
import dailyRoutes from './routes/daily.js';
import mcqRoutes from './routes/mcq.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/mcq', mcqRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Prepx API running' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Prepx server running on http://localhost:${PORT}`));
