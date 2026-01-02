const { STATUS } = require('../utils/constants');

/**
 * Global error handling middleware
 * @param {Error} err 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: 'User already exists',
    });
  }

  // Default server error
  res.status(err.statusCode || STATUS.SERVER_ERROR).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

/**
 * Handle 404 routes
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFound };