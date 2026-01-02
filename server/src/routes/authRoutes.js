const express = require('express');
const { register, login, getStatus } = require('../controllers/authController');

const router = express.Router();


/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user (with brute-force protection)
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/status
 * @desc    Check lockout status for user/IP
 * @access  Public
 */
router.get('/status', getStatus);

module.exports = router;