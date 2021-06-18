const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    typeOfCustomer: {
      type: String,
      enum: ['Regular', 'Event'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    address: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    group: {
      type: mongoose.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
