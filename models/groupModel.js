const mongoose = require('mongoose');

// While adding products for customer, ensure that only unique products are added, with maximum size being 2, 18L and 20L
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    customers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
