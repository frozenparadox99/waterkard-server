const mongoose = require('mongoose');
const APIError = require('../utils/apiError');

const vendorSchema = new mongoose.Schema(
  {
    // Change group name to group id ref
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

//  eslint-disable-next-line
vendorSchema.post('save', function handleError(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    switch (Object.keys(error.keyPattern)[0]) {
      case 'mobileNumber':
        return next(new APIError('Mobile number already exists', 400));
      default:
        return next(new APIError('Something went wrong', 500));
    }
  } else {
    const vals = Object.values(error.errors);
    if (vals.length > 0) {
      return next(
        new APIError(
          vals[0]?.properties?.message || 'Something went wrong',
          400
        )
      );
    }
    return next();
  }
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
