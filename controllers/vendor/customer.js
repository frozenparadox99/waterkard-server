const mongoose = require('mongoose');
const APIError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');

const Customer = require('../../models/customerModel');
const CustomerProduct = require('../../models/customerProductModel');
const TotalInventory = require('../../models/totalInventoryModel');

const { successfulRequest } = require('../../utils/responses');

const customer = {
  registerCustomer: catchAsync(async (req, res, next) => {
    const {
      typeOfCustomer,
      name,
      mobileNumber,
      address,
      city,
      area,
      pincode,
      email,
      group,
      vendor,
      product,
      balanceJars,
      dispenser,
      deposit,
      rate,
    } = req.body;

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const customer = await Customer.create(
        [
          {
            typeOfCustomer,
            name,
            email,
            mobileNumber,
            address,
            city,
            area,
            pincode,
            group,
            vendor,
          },
        ],
        { session: session }
      );

      const customerProduct = await CustomerProduct.create(
        [
          {
            product,
            balanceJars,
            dispenser,
            deposit,
            rate,
            customer: customer[0]._id,
          },
        ],
        { session: session }
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
};

module.exports = customer;
