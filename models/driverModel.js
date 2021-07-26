const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const APIError = require('../utils/apiError');

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    group: {
      type: mongoose.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    password: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

driverSchema.pre('save', function preSave(next) {
  if (this.isNew) {
    const generatePassword = customAlphabet(
      '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      6
    );
    this.password = generatePassword();
  }
  next();
});

// eslint-disable-next-line
driverSchema.post('save', function handleError(error, doc, next) {
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

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
