const mongoose = require('mongoose');
const Customer = require('../../models/customerModel');
const CustomerProduct = require('../../models/customerProductModel');
const dateHelpers = require('../../helpers/date.helpers');
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
  getCustomers: catchAsync(async (req, res, next) => {
    const { vendor, group, product, date, type } = req.query;
    const page = parseInt(req.query.page || 1, 10);
    const skip = (page - 1) * 20;
    const limit = 20;
    const parsedDate = dateHelpers.createDateFromString(date || '');
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }
    const customerMatchStage = {
      $match: {
        vendor: mongoose.Types.ObjectId(vendor),
      },
    };
    const jarAndPaymentsLookup = {
      let: {
        vendor: '$vendor',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$vendor', '$$vendor'],
                },
              ],
            },
          },
        },
      ],
    };
    const finalMatch = {
      $match: {
        $expr: {
          $and: [
            {
              $eq: ['$_id', '$jarAndPayments.transactions.customer'],
            },
          ],
        },
      },
    };
    if (group) {
      customerMatchStage.$match = {
        ...customerMatchStage.$match,
        group: mongoose.Types.ObjectId(group),
      };
    }
    if (type) {
      customerMatchStage.$match = {
        ...customerMatchStage.$match,
        typeOfCustomer: type,
      };
    }
    const props = [
      { name: 'group', val: group && mongoose.Types.ObjectId(group) },
      { name: 'date', val: parsedDate.data },
    ];
    if (group || date) {
      props.forEach(el => {
        if (el.val) {
          jarAndPaymentsLookup.let = {
            ...jarAndPaymentsLookup.let,
            [el.name]: el.val,
          };
          jarAndPaymentsLookup.pipeline[0].$match.$expr.$and.push({
            $eq: [`$${el.name}`, `$$${el.name}`],
          });
        }
      });
    }
    if (product) {
      finalMatch.$match.$expr.$and.push({
        $eq: [product, '$jarAndPayments.transactions.product'],
      });
    }
    const customers = await Customer.aggregate([
      {
        $facet: {
          customers: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
              },
            },
            {
              $sort: {
                name: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: 'dailyjarandpayments',
                ...jarAndPaymentsLookup,
                as: 'jarAndPayments',
              },
            },
            {
              $unwind: {
                path: '$jarAndPayments',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $unwind: {
                path: '$jarAndPayments.transactions',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              ...finalMatch,
            },
            {
              $group: {
                _id: '$jarAndPayments.transactions.customer',
                totalEmptyCollected: {
                  $sum: '$jarAndPayments.transactions.emptyCollected',
                },
                totalSold: {
                  $sum: '$jarAndPayments.transactions.soldJars',
                },
                name: { $first: '$name' },
              },
            },
          ],
          deposits: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                _id: 1,
              },
            },
            {
              $sort: {
                name: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: 'customerproducts',
                localField: '_id',
                foreignField: 'customer',
                as: 'customerProducts',
              },
            },
            {
              $unwind: {
                path: '$customerProducts',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$_id',
                totalDeposit: {
                  $sum: '$customerProducts.deposit',
                },
                totalBalance: {
                  $sum: '$customerProducts.balanceJars',
                },
                name: { $first: '$name' },
              },
            },
          ],
        },
      },
    ]);
    const customersFinal = customers[0].deposits.map(el => {
      let details = customers[0].customers.filter(
        ele => ele._id.toString() === el._id.toString()
      )[0];
      if (!details) {
        details = {
          totalEmptyCollected: 0,
          totalSold: 0,
        };
      }
      return {
        ...el,
        ...details,
      };
    });
    return successfulRequest(res, 200, {
      customers: customersFinal,
      final: customers[0].deposits.length < limit,
    });
  }),
};

module.exports = customerController;
