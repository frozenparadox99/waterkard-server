const mongoose = require('mongoose');
const Order = require('../../models/orderModel');
const CustomerProduct = require('../../models/customerProductModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const orderController = {
  addOrder: catchAsync(async (req, res, next) => {
    const { customer, product, preferredDate, jarQty, vendor } = req.body;
    const customerProduct = await CustomerProduct.findById(product);
    if (!customerProduct) {
      return next(new APIError('This product does not exist', 400));
    }
    if (customerProduct.customer.toString() !== customer) {
      return next(
        new APIError(
          'This product is not available for the specified customer',
          400
        )
      );
    }
    const parsedDate = dateHelpers.createDateFromString(preferredDate);
    if (!parsedDate.success) {
      return next(new APIError('Invalid preferred date', 400));
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      await Order.create(
        [
          {
            customer,
            product,
            vendor,
            preferredDate: parsedDate.data,
            jarQty,
          },
        ],
        { session }
      );

      const custProd = await CustomerProduct.findOne(
        { customer, vendor, product },
        'deposit customer product rate balanceJars dispenser',
        { session }
      );
      console.log(custProd);

      const amount = jarQty * custProd.rate;

      custProd.deposit -= amount;

      await custProd.save().session(session);

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
      return next(new APIError('Failed to create order', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
};

module.exports = orderController;
