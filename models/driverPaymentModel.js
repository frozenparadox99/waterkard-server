const mongoose = require('mongoose');

const driverPaymentSchema = new mongoose.Schema(
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
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'Customer',
    },
    from: {
      type: String,
      enum: ['Driver', 'Customer'],
      required: true,
    },
    to: {
      type: String,
      enum: ['Vendor', 'Driver'],
    },
    product: {
      type: String,
      enum: ['18L', '20L'],
      required: true,
    },
    mode: {
      type: String,
      enum: ['Cash', 'Online', 'Cheque'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    chequeDetails: {
      type: String,
    },
    onlineAppForPayment: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const DriverPayment = mongoose.model('DriverPayment', driverPaymentSchema);

module.exports = DriverPayment;
