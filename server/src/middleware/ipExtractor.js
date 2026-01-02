/**
 * Middleware to extract client IP address
 * Handles proxy scenarios (Railway, Heroku, etc.)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const extractIP = (req, res, next) => {
  // Try to get IP from various headers (in order of preference)
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() || // Behind proxy (Railway, Vercel, etc.)
    req.headers['x-real-ip'] || // Nginx proxy
    req.connection.remoteAddress || // Direct connection
    req.socket.remoteAddress || // Socket connection
    req.ip; // Express default

  // Attach IP to request object for easy access
  req.clientIP = ip;

  next();
};

module.exports = extractIP;