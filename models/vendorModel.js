const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    defaultGroupName: {
      type: String,
      required: true,
    },
    firstDriverName: {
      type: String,
      required: true,
    },
    firstDriverMobileNumber: {
      type: String,
      required: true,
    },
    fullBusinessName: {
      type: String,
      required: true,
    },
    fullVendorName: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
