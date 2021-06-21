const mongoose = require('mongoose');
const Driver = require('../../models/driverModel');
const Customer = require('../../models/customerModel');
const DailyInventory = require('../../models/dailyInventoryModel');
const DailyJarAndPayment = require('../../models/dailyJarAndPaymentModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const driverController = {
  addDriver: catchAsync(async (req, res, next) => {
    const { name, mobileNumber, vendor, group } = req.body;
    // 1) Find driver documents which match the group passed in req.body
    const currentDriver = await Driver.findOne({ group });
    console.log(currentDriver);

    // 2) If this document exists then raise an error because only on driver can belong to one group
    if (currentDriver) {
      return next(new APIError('One group for One driver', 401));
    }

    // 3) Continue with adding the driver

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const driver = await Driver.create(
        [{ name, mobileNumber, vendor, group }],
        {
          session,
        }
      );

      // commit the changes if everything was successful
      await session.commitTransaction();
    } catch (error) {
      // if anything fails above just rollback the changes here

      // this will rollback any changes made in the database
      await session.abortTransaction();

      // logging the error
      // console.error('-----------------------------------');
      console.error(error);

      // rethrow the error
      return next(new APIError('Failed to create vendor', 401));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
  addTransaction: catchAsync(async (req, res, next) => {
    const {
      vendor,
      driver,
      customer,
      soldJars,
      emptyCollected,
      product,
      date: stringDate,
    } = req.body;
    const date = dateHelpers.createDateFromString(stringDate);
    if (!date.success) {
      return next(new APIError('Invalid date', 400));
    }
    const dailyInventory = await DailyInventory.findOne({
      vendor,
      driver,
      date: date.data,
    });
    if (!dailyInventory) {
      return next(
        new APIError(
          'Daily inventory/load has not been created yet. Please create it first and then add daily transactions',
          400
        )
      );
    }
    const currentDriver = await Driver.findOne(
      { _id: driver, vendor },
      { group: 1 }
    );
    if (!currentDriver) {
      return next(
        new APIError('Driver does not exist. Please add the driver first', 400)
      );
    }
    const currentCustomer = await Customer.findOne({
      vendor,
      group: currentDriver.group,
    });
    if (!currentCustomer) {
      return next(
        new APIError(
          'Customer does not exist. Please add the customer first',
          400
        )
      );
    }
    const dailyJarAndPayment = await DailyJarAndPayment.findOne({
      vendor,
      driver,
      date: date.data,
    });
    if (!dailyJarAndPayment) {
      const transactions = [{ customer, soldJars, emptyCollected, product }];
      const jarAndPayment = await DailyJarAndPayment.create({
        vendor,
        driver,
        date: date.data,
        transactions,
      });
      return successfulRequest(res, 201, { dailyJarAndPayment: jarAndPayment });
    }
    const exists = dailyJarAndPayment.transactions.filter(
      el => el.customer.toString() === customer && el.product === product
    );
    if (exists.length > 0) {
      return next(
        new APIError(
          'Transaction for this customer and this product has been done for the specified date. Please edit or delete this entry',
          400
        )
      );
    }
    dailyJarAndPayment.transactions.push({
      customer,
      soldJars,
      emptyCollected,
      product,
    });
    await dailyJarAndPayment.save();
    return successfulRequest(res, 200, { dailyJarAndPayment });
  }),
};

module.exports = driverController;
