const mongoose = require('mongoose');

const totalInventorySchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      unique: true,
    },
    stock: [
      {
        coolJarStock: {
          type: Number,
          default: 0,
        },
        bottleJarStock: {
          type: Number,
          default: 0,
        },
        dateAdded: {
          type: Date,
        },
      },
    ],
    removedStock: [
      {
        coolJarStock: {
          type: Number,
          default: 0,
        },
        bottleJarStock: {
          type: Number,
          default: 0,
        },
        dateAdded: {
          type: Date,
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TotalInventory = mongoose.model('TotalInventory', totalInventorySchema);

module.exports = TotalInventory;
