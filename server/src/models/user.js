const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema for Brute-Force Protected Login
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    // Array of timestamps for failed login attempts
    failedAttempts: [
      {
        timestamp: {
          type: Date,
          required: true,
        },
      },
    ],
    // Suspension tracking
    suspendedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Middleware: Hash password before saving to database.
 * Only hashes if the password field is new or modified.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method: Compare entered password with hashed password in DB
 * @param {string} candidatePassword - Password from login request
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Method: Check if user is currently under suspension
 * @returns {boolean}
 */
userSchema.methods.isSuspended = function () {
  if (!this.suspendedUntil) return false;
  return new Date() < this.suspendedUntil;
};

/**
 * Method: Calculate remaining suspension time
 * @returns {number} Time in milliseconds
 */
userSchema.methods.getRemainingLockoutTime = function () {
  if (!this.isSuspended()) return 0;
  return this.suspendedUntil - new Date();
};

/**
 * FINAL CORRECTION: 
 * Prevents OverwriteModelError by checking if model exists before compiling.
 */
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;