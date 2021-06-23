const mongoose = require('mongoose');
const Customer = require('../../models/customerModel');
const CustomerProduct = require('../../models/customerProductModel');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const customerController = {
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
        { session }
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
        { session }
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
      return next(new APIError('Failed to add customer', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
  addCustomerProduct: catchAsync(async (req, res, next) => {
    const { product, balanceJars, dispenser, deposit, rate, customer } =
      req.body;

    // 1) Get products for the current customer
    const currentProductsForCustomer = await CustomerProduct.find({
      customer,
    });
    console.log(currentProductsForCustomer);

    // 2) Check the number of products. If it is 2 then no more can be added.
    if (
      currentProductsForCustomer.length &&
      currentProductsForCustomer.length >= 2
    ) {
      return next(
        new APIError('Only two products for a customer can be added', 400)
      );
    }

    // 3) If it is 1 then store its product type
    if (
      currentProductsForCustomer.length &&
      currentProductsForCustomer.length === 1
    ) {
      const currentProductType = currentProductsForCustomer[0].product;
      // 4) Compare the product type with the product in req.body. If its the same then the product can't be added
      if (currentProductType === product) {
        return next(
          new APIError('This product already exists for this customer', 400)
        );
      }
    }

    // 5) Proceed with adding the product

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const customerProduct = await CustomerProduct.create(
        [
          {
            product,
            balanceJars,
            dispenser,
            deposit,
            rate,
            customer,
          },
        ],
        { session }
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
      return next(new APIError('Failed to add product', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
};

module.exports = customerController;
