const mongoose = require('mongoose');

// While adding products for customer, ensure that only unique products are added, with maximum size being 2, 18L and 20L
const totalInventorySchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: true,
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
