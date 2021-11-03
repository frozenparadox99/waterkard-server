const mongoose = require('mongoose');

// While adding products for customer, ensure that only unique products are added, with maximum size being 2, 18L and 20L
const customerProductSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    product: {
      type: String,
      required: true,
      enum: ['18L', '20L'],
    },
    rate: {
      type: Number,
      required: true,
    },
    balanceJars: {
      type: Number,
      required: true,
    },
    balancePayment: {
      type: Number,
      default: 0,
    },
    deposit: {
      type: Number,
      required: true,
    },
    dispenser: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CustomerProduct = mongoose.model(
  'CustomerProduct',
  customerProductSchema
);

module.exports = CustomerProduct;
