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
        status: {
          type: String,
          enum: ['completed', 'skipped'],
          required: true,
          default: 'completed',
        },
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

const DailyJarAndPayment = mongoose.model(
  'DailyJarAndPayment',
  dailyJarAndPaymentSchema
);

module.exports = DailyJarAndPayment;
