const User = require('../models/user.js');
const {
  checkUserLockout,
  checkIPLockout,
  recordFailedAttempt,
  clearUserAttempts,
} = require('../services/lockoutService');
const {
  validateLoginInput,
  validateRegisterInput,
} = require('../utils/validators');
const { STATUS, MESSAGES } = require('../utils/constants');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateRegisterInput(email, password);
    if (!validation.valid) {
      return res.status(STATUS.BAD_REQUEST).json({
        success: false,
        message: validation.error,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.USER_EXISTS,
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      email: email.toLowerCase(),
      password,
    });

    res.status(STATUS.CREATED).json({
      success: true,
      message: MESSAGES.REGISTRATION_SUCCESS,
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user with brute-force protection
 * @route POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const clientIP = req.clientIP;

    // Validate input
    const validation = validateLoginInput(email, password);
    if (!validation.valid) {
      return res.status(STATUS.BAD_REQUEST).json({
        success: false,
        message: validation.error,
      });
    }

    // STEP 1: Check if IP is blocked
    const ipStatus = await checkIPLockout(clientIP);
    if (ipStatus.blocked) {
      return res.status(STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message: MESSAGES.IP_BLOCKED,
        remainingTime: Math.ceil(ipStatus.remainingTime / 1000), // seconds
      });
    }

    // STEP 2: Check if user is suspended
    const userStatus = await checkUserLockout(email.toLowerCase());
    if (userStatus.suspended) {
      return res.status(STATUS.FORBIDDEN).json({
        success: false,
        message: MESSAGES.USER_SUSPENDED,
        remainingTime: Math.ceil(userStatus.remainingTime / 1000), // seconds
      });
    }

    // STEP 3: Find user and verify credentials
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      // Record failed attempt
      await recordFailedAttempt(email.toLowerCase(), clientIP);

      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // STEP 4: Successful login - clear user attempts
    await clearUserAttempts(email.toLowerCase());

    res.status(STATUS.SUCCESS).json({
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get lockout status for current user/IP (optional - for better UX)
 * @route GET /api/auth/status
 */
const getStatus = async (req, res, next) => {
  try {
    const { email } = req.query;
    const clientIP = req.clientIP;

    const ipStatus = await checkIPLockout(clientIP);
    
    let userStatus = { suspended: false, remainingTime: 0 };
    if (email) {
      userStatus = await checkUserLockout(email.toLowerCase());
    }

    res.status(STATUS.SUCCESS).json({
      success: true,
      data: {
        ip: {
          blocked: ipStatus.blocked,
          remainingTime: Math.ceil(ipStatus.remainingTime / 1000),
        },
        user: {
          suspended: userStatus.suspended,
          remainingTime: Math.ceil(userStatus.remainingTime / 1000),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getStatus,
};