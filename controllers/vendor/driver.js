const mongoose = require('mongoose');
const Driver = require('../../models/driverModel');
const Customer = require('../../models/customerModel');
const CustomerProduct = require('../../models/customerProductModel');
const TotalInventory = require('../../models/totalInventoryModel');
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
      return next(new APIError('Failed to add driver', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
  addTransaction: catchAsync(async (req, res, next) => {
    // bug => loaded < sell
    const {
      vendor,
      driver,
      customer,
      soldJars,
      emptyCollected,
      product,
      status,
      date: stringDate,
    } = req.body;
    const date = dateHelpers.createDateFromString(stringDate);
    if (!date.success) {
      return next(new APIError('Invalid date', 400));
    }
    const totalInventory = await TotalInventory.findOne({
      vendor,
    });
    if (!totalInventory) {
      return next(
        new APIError(
          'Inventory does not exist for this vendor. Please create it first',
          400
        )
      );
    }
    const dailyInventory = await DailyInventory.findOne({
      vendor,
      driver,
      date: date.data,
    });
    if (!dailyInventory) {
      return next(
        new APIError(
          'Daily inventory has not been created yet. Please create it first and then add daily transactions',
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
    const currentCustomer = await Customer.findById(customer);
    if (!currentCustomer) {
      return next(
        new APIError(
          'Customer does not exist. Please add the customer first',
          400
        )
      );
    }
    const customerProduct = await CustomerProduct.findOne({
      customer,
      product,
    });
    if (!customerProduct && status === 'completed') {
      return next(
        new APIError('Please add the product for this customer first', 400)
      );
    }
    const dailyJarAndPayment = await DailyJarAndPayment.findOne({
      vendor,
      driver,
      date: date.data,
    });
    // sold18+ soldJars > load18 => return error
    // sold20 + soldJars > load20 => return error
    if (!dailyJarAndPayment) {
      const transactions = [];
      if (status === 'skipped') {
        transactions.push({ customer, status });
      } else {
        transactions.push({
          customer,
          soldJars,
          emptyCollected,
          product,
          status,
        });
      }
      const jarAndPayment = await DailyJarAndPayment.create({
        vendor,
        driver,
        date: date.data,
        transactions,
      });
      if (product === '18L') {
        totalInventory.customerCoolJarBalance +=
          parseInt(soldJars, 10) - parseInt(emptyCollected, 10);
      }
      if (product === '20L') {
        totalInventory.customerBottleJarBalance +=
          parseInt(soldJars, 10) - parseInt(emptyCollected, 10);
      }
      if (status === 'completed') {
        customerProduct.balanceJars +=
          parseInt(soldJars, 10) - parseInt(emptyCollected, 10);
        customerProduct.balancePayment +=
          parseInt(soldJars, 10) * customerProduct.rate;
        currentCustomer.balancePayment +=
          parseInt(soldJars, 10) * customerProduct.rate;
        await currentCustomer.save();
        await customerProduct.save();
        await totalInventory.save();
      }
      return successfulRequest(res, 201, { dailyJarAndPayment: jarAndPayment });
    }
    const exists = dailyJarAndPayment.transactions.filter(
      el =>
        el.customer.toString() === customer &&
        (status === 'completed' ? el.product === product : true)
    );
    if (exists.length > 0) {
      return next(
        new APIError(
          'Transaction for this customer and this product has been done for the specified date. Please edit this entry if needed',
          400
        )
      );
    }
    if (status === 'completed') {
      dailyJarAndPayment.transactions.push({
        customer,
        soldJars,
        emptyCollected,
        product,
        status,
      });
    } else {
      dailyJarAndPayment.transactions.push({ customer, status });
    }
    await dailyJarAndPayment.save();
    if (product === '18L') {
      totalInventory.customerCoolJarBalance +=
        parseInt(soldJars, 10) - parseInt(emptyCollected, 10);
    }
    if (product === '20L') {
      totalInventory.customerBottleJarBalance +=
        parseInt(soldJars, 10) - parseInt(emptyCollected, 10);
    }
    if (status === 'completed') {
      customerProduct.balanceJars +=
        parseInt(soldJars, 10) - parseInt(emptyCollected, 10);
      customerProduct.balancePayment +=
        parseInt(soldJars, 10) * customerProduct.rate;
      currentCustomer.balancePayment +=
        parseInt(soldJars, 10) * customerProduct.rate;
      await currentCustomer.save();
      await totalInventory.save();
      await customerProduct.save();
    }
    return successfulRequest(res, 200, { dailyJarAndPayment });
  }),
  getDriversForVendor: catchAsync(async (req, res, next) => {
    const { vendor } = req.query;
    const drivers = await Driver.find({
      vendor,
    }).populate('group');
    if (!drivers || drivers.length === 0) {
      return next(new APIError('No drivers found for the vendor', 400));
    }

    return successfulRequest(res, 201, { drivers });
  }),
  getDriverDetails: catchAsync(async (req, res, next) => {
    const { driverId } = req.query;
    const driver = await Driver.findById(driverId).populate({
      populate: 'groups',
    });
    if (!driver) {
      return next(new APIError('No driver found for the given Id', 400));
    }
    return successfulRequest(res, 201, { driver });
  }),
  getDriverData: catchAsync(async (req, res, next) => {
    const { driverId } = req.query;
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return next(new APIError('No driver found for the given Id', 400));
    }
    return successfulRequest(res, 201, { driver });
  }),
};

module.exports = driverController;
