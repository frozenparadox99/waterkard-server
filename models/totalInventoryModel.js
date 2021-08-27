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
    totalStock: { type: Number, min: 0, default: 0 },
    godownCoolJarStock: { type: Number, min: 0, default: 0 },
    godownBottleJarStock: { type: Number, min: 0, default: 0 },
    missingCoolJars: { type: Number, min: 0, default: 0 },
    missingBottleJars: { type: Number, min: 0, default: 0 },
    customerCoolJarBalance: { type: Number, min: 0, default: 0 },
    customerBottleJarBalance: { type: Number, min: 0, default: 0 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

totalInventorySchema.pre('save', function preSave(next) {
  if (this.isNew) {
    this.godownCoolJarStock = this.stock.reduce(
      (acc, curr) => acc + curr.coolJarStock,
      0
    );
    this.godownBottleJarStock = this.stock.reduce(
      (acc, curr) => acc + curr.bottleJarStock,
      0
    );
    this.totalStock = this.godownCoolJarStock + this.godownBottleJarStock;
  }
  next();
});

const TotalInventory = mongoose.model('TotalInventory', totalInventorySchema);

module.exports = TotalInventory;
