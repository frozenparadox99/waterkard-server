const mongoose = require('mongoose');
const CustomerPayment = require('../../models/customerPaymentModel');
// const CustomerProduct = require('../../models/customerProductModel');
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
    const customerInDb = await Customer.findOne({ vendor });
    console.log(customerInDb);

    if (!customerInDb) {
      return next(
        new APIError('The vendor does not have the specified customer', 400)
      );
    }

    // 2) If mode is cheque, cheque details should not be empty
    if (mode === 'Cheque' && (!chequeDetails || chequeDetails === '')) {
      return next(new APIError('Please specify cheque details', 400));
    }

    // 3) If mode is online, onlineAppForPayment should not be empty
    if (
      mode === 'Online' &&
      (!onlineAppForPayment || onlineAppForPayment === '')
    ) {
      return next(new APIError('Please specify online App for Payment ', 400));
    }

    // 4) Save payment in the Customer Payment collection

    // 5) Based on the product, find and update the deposit amount => should be done in the order part

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
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

      //   const custProd = await CustomerProduct.findOne(
      //     { customer, product },
      //     'deposit customer product rate balanceJars dispenser',
      //     { session }
      //   );
      //   console.log(custProd);

      //   custProd.deposit -= amount;

      //   await custProd.save().session(session);

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
      return next(new APIError('Failed to create customer payment', 401));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
};

module.exports = paymentController;
