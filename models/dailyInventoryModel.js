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
    },
    unloadReturned20: {
      type: Number,
    },
    unloadEmpty18: {
      type: Number,
    },
    unloadEmpty20: {
      type: Number,
    },
    date: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const DailyInventory = mongoose.model('DailyInventory', dailyInventorySchema);

module.exports = DailyInventory;
