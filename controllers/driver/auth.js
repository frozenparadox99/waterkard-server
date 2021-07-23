const mongoose = require('mongoose');
const Driver = require('../../models/driverModel');
const Customer = require('../../models/customerModel');
const CustomerProduct = require('../../models/customerProductModel');
const DailyInventory = require('../../models/dailyInventoryModel');
const DailyJarAndPayment = require('../../models/dailyJarAndPaymentModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const authController = {
  login: catchAsync(async (req, res, next) => {
    const { mobileNumber, password } = req.body;
    const driver = await Driver.findOne({ mobileNumber });
    if (!driver) {
      return next(new APIError('No driver found with this mobile number', 400));
    }
    if (password !== driver.password) {
      return next(new APIError('Incorrect password', 401));
    }
    return successfulRequest(res, 200, { id: driver._id, name: driver.name });
  }),
};

module.exports = authController;
