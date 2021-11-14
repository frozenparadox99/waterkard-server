const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    driver: {
      type: mongoose.Types.ObjectId,
      ref: 'Driver',
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'CustomerProduct',
      required: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    jarQty: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
