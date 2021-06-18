const Order = require('../../models/orderModel');
const CustomerProduct = require('../../models/customerProductModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const orderController = {
  addOrder: catchAsync(async (req, res, next) => {
    const { customer, product, preferredDate, jarQty } = req.body;
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
    await Order.create({
      customer,
      product,
      preferredDate: parsedDate.data,
      jarQty,
    });
    return successfulRequest(res, 201, {});
  }),
};

module.exports = orderController;
