const mongoose = require('mongoose');

const customerPaymentSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ['Cash', 'Online', 'Cheque'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    date: {
      type: Date,
    },
    chequeDetails: {
      type: String,
    },
    onlineAppForPayment: {
      type: String,
    },
    product: {
      type: String,
      required: true,
      enum: ['18L', '20L'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CustomerPayment = mongoose.model(
  'CustomerPayment',
  customerPaymentSchema
);

module.exports = CustomerPayment;
