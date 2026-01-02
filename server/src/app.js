const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const extractIP = require('./middleware/ipExtractor');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Trust proxy - important for Railway/Heroku to get correct IP
app.set('trust proxy', 1);

// Middleware - CORS Configuration for Production
const allowedOrigins = [
  process.env.CLIENT_URL 
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom IP extraction middleware
app.use(extractIP);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;