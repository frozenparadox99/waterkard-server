const mongoose = require('mongoose');

const dailyJarAndPaymentSchema = new mongoose.Schema(
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
    date: {
      type: Date,
    },
    transactions: [
      {
        customer: {
          type: mongoose.Types.ObjectId,
          ref: 'Customer',
          required: true,
        },
        soldJars: {
          type: Number,
        },
        emptyCollected: {
          type: Number,
        },
        product: {
          type: String,
          enum: ['18L', '20L'],
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const DailyJarAndPayment = mongoose.model(
  'DailyJarAndPayment',
  dailyJarAndPaymentSchema
);

module.exports = DailyJarAndPayment;
