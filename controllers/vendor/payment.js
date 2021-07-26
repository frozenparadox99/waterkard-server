const mongoose = require('mongoose');
const CustomerPayment = require('../../models/customerPaymentModel');
const CustomerProduct = require('../../models/customerProductModel');
const Customer = require('../../models/customerModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const paymentController = {
  addCustomerPayment: catchAsync(async (req, res, next) => {
    const {
      customer,
      mode,
      vendor,
      date,
      amount,
      chequeDetails,
      onlineAppForPayment,
      product,
    } = req.body;

    const parsedDate = dateHelpers.createDateFromString(date);
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }

    // 1) Check if customer belongs to vendor
    const customerInDb = await Customer.findOne({ _id: customer, vendor });
    console.log(customerInDb);

    if (!customerInDb) {
      return next(new APIError('This customer does not exist', 400));
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      // 4) Save payment in the Customer Payment collection
      const customerPayment = await CustomerPayment.create(
        [
          {
            customer,
            mode,
            vendor,
            date,
            amount,
            chequeDetails,
            onlineAppForPayment,
            product,
          },
        ],
        { session }
      );

      // 5) Based on the product, find and update the deposit amount

      const custProd = await CustomerProduct.findOne(
        { customer, product },
        'deposit customer product rate balanceJars dispenser',
        { session }
      );
      console.log(custProd);

      custProd.deposit += parseInt(amount, 10);

      await custProd.save();

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
      return next(new APIError('Failed to create customer payment', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
};

module.exports = paymentController;
