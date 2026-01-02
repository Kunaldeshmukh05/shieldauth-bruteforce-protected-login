const mongoose = require('mongoose');

const ipBlockSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: [true, 'IP address is required'],
      unique: true,
      index: true,
    },
    // Array of failed attempts with timestamp and email
    failedAttempts: [
      {
        timestamp: {
          type: Date,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    ],
    // Block tracking
    blockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if IP is currently blocked
ipBlockSchema.methods.isBlocked = function () {
  if (!this.blockedUntil) return false;
  return new Date() < this.blockedUntil;
};

// Method to get remaining block time in milliseconds
ipBlockSchema.methods.getRemainingBlockTime = function () {
  if (!this.isBlocked()) return 0;
  return this.blockedUntil - new Date();
};

const IPBlock = mongoose.model('IPBlock', ipBlockSchema);

module.exports = IPBlock;