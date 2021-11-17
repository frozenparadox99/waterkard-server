const mongoose = require('mongoose');

const dailyInventorySchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    driver: {
      type: mongoose.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    load18: {
      type: Number,
    },
    load20: {
      type: Number,
    },
    unloadReturned18: {
      type: Number,
      default: 0,
    },
    unloadReturned20: {
      type: Number,
      default: 0,
    },
    unloadEmpty18: {
      type: Number,
      default: 0,
    },
    unloadEmpty20: {
      type: Number,
      default: 0,
    },
    expectedReturned18: {
      type: Number,
    },
    expectedReturned20: {
      type: Number,
    },
    expectedEmpty18: {
      type: Number,
    },
    expectedEmpty20: {
      type: Number,
    },
    missingReturned18: {
      type: Number,
    },
    missingReturned20: {
      type: Number,
    },
    missingEmpty18: {
      type: Number,
    },
    missingEmpty20: {
      type: Number,
    },
    sold18: {
      type: Number,
    },
    sold20: {
      type: Number,
    },
    date: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const DailyInventory = mongoose.model('DailyInventory', dailyInventorySchema);

module.exports = DailyInventory;
