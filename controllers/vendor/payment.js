const mongoose = require('mongoose');
const DriverPayment = require('../../models/driverPaymentModel');
const CustomerPayment = require('../../models/customerPaymentModel');
const CustomerProduct = require('../../models/customerProductModel');
const Customer = require('../../models/customerModel');
const Driver = require('../../models/driverModel');
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
            date: parsedDate.data,
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
  addDriverPayment: catchAsync(async (req, res, next) => {
    const {
      vendor,
      driver,
      customer,
      from,
      to,
      product,
      mode,
      amount,
      chequeDetails,
      onlineAppForPayment,
      date: stringDate,
    } = req.body;
    const date = dateHelpers.createDateFromString(stringDate);
    if (!date.success) {
      return next(new APIError('Invalid date', 400));
    }
    const session = await mongoose.startSession();
    let driverPayment;
    session.startTransaction();
    try {
      driverPayment = await DriverPayment.create(
        [
          {
            vendor,
            driver,
            customer,
            from,
            to,
            product,
            mode,
            amount,
            chequeDetails,
            onlineAppForPayment,
            date: date.data,
          },
        ],
        { session }
      );
      if (from === 'Customer' && to === 'Driver') {
        const customerProduct = await CustomerProduct.findOne(
          {
            customer,
            product,
          },
          { deposit: 1 },
          { session }
        );
        if (!customerProduct) {
          throw Error(
            'Please add this product for the specified customer first'
          );
        }
        customerProduct.deposit += +amount;
        await customerProduct.save();
        await session.commitTransaction();
      }
    } catch (err) {
      await session.abortTransaction();
      return next(new APIError(err.message, 400));
    } finally {
      session.endSession();
    }
    return successfulRequest(res, 200, { driverPayment });
  }),
  getDriverPayments: catchAsync(async (req, res, next) => {
    const { vendor } = req.query;
    const driverPayments = await Driver.aggregate([
      {
        $facet: {
          received: [
            {
              $match: {
                vendor: mongoose.Types.ObjectId(vendor),
              },
            },
            {
              $project: {
                name: 1,
                vendor: 1,
              },
            },
            {
              $lookup: {
                from: 'driverpayments',
                let: {
                  vendor: '$vendor',
                  driver: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$vendor', '$$vendor'],
                          },
                          {
                            $eq: ['$driver', '$$driver'],
                          },
                          {
                            $eq: ['$from', 'Customer'],
                          },
                          {
                            $eq: ['$to', 'Driver'],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      amount: 1,
                    },
                  },
                ],
                as: 'driverpayments',
              },
            },
            {
              $unwind: {
                path: '$driverpayments',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$_id',
                received: { $sum: '$driverpayments.amount' },
                name: { $first: '$name' },
              },
            },
          ],
          given: [
            {
              $match: {
                vendor: mongoose.Types.ObjectId(vendor),
              },
            },
            {
              $project: {
                name: 1,
                vendor: 1,
              },
            },
            {
              $lookup: {
                from: 'driverpayments',
                let: {
                  vendor: '$vendor',
                  driver: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$vendor', '$$vendor'],
                          },
                          {
                            $eq: ['$driver', '$$driver'],
                          },
                          {
                            $eq: ['$from', 'Driver'],
                          },
                          {
                            $eq: ['$to', 'Vendor'],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      amount: 1,
                    },
                  },
                ],
                as: 'driverpayments',
              },
            },
            {
              $unwind: {
                path: '$driverpayments',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$_id',
                given: { $sum: '$driverpayments.amount' },
                name: { $first: '$name' },
              },
            },
          ],
          today: [
            {
              $match: {
                vendor: mongoose.Types.ObjectId(vendor),
              },
            },
            {
              $project: {
                name: 1,
                vendor: 1,
              },
            },
            {
              $lookup: {
                from: 'driverpayments',
                let: {
                  vendor: '$vendor',
                  driver: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$vendor', '$$vendor'],
                          },
                          {
                            $eq: ['$driver', '$$driver'],
                          },
                          {
                            $eq: ['$from', 'Customer'],
                          },
                          {
                            $eq: ['$to', 'Driver'],
                          },
                          {
                            $eq: [
                              '$date',
                              new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                new Date().getDate()
                              ),
                            ],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      amount: 1,
                    },
                  },
                ],
                as: 'driverpayments',
              },
            },
            {
              $unwind: {
                path: '$driverpayments',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$_id',
                received: { $sum: '$driverpayments.amount' },
                name: { $first: '$name' },
              },
            },
          ],
        },
      },
    ]);
    const payments = driverPayments[0].received.map(el => {
      const givenRes = driverPayments[0].given.filter(
        ele => ele._id.toString() === el._id.toString()
      )[0];
      const todayRes = driverPayments[0].today.filter(
        ele => ele._id.toString() === el._id.toString()
      )[0];
      return {
        _id: el._id,
        name: el.name,
        received: el.received,
        given: givenRes.given,
        today: todayRes.received,
      };
    });
    return successfulRequest(res, 200, {
      payments,
    });
  }),
  getDriverPaymentsByDriver: catchAsync(async (req, res, next) => {
    const { driver } = req.query;
    const driverPayments = await Driver.aggregate([
      {
        $facet: {
          received: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(driver),
              },
            },
            {
              $project: {
                name: 1,
                vendor: 1,
              },
            },
            {
              $lookup: {
                from: 'driverpayments',
                let: {
                  vendor: '$vendor',
                  driver: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$vendor', '$$vendor'],
                          },
                          {
                            $eq: ['$driver', '$$driver'],
                          },
                          {
                            $eq: ['$from', 'Customer'],
                          },
                          {
                            $eq: ['$to', 'Driver'],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      amount: 1,
                    },
                  },
                ],
                as: 'driverpayments',
              },
            },
            {
              $unwind: {
                path: '$driverpayments',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$_id',
                received: { $sum: '$driverpayments.amount' },
                name: { $first: '$name' },
              },
            },
          ],
          given: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(driver),
              },
            },
            {
              $project: {
                name: 1,
                vendor: 1,
              },
            },
            {
              $lookup: {
                from: 'driverpayments',
                let: {
                  vendor: '$vendor',
                  driver: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$vendor', '$$vendor'],
                          },
                          {
                            $eq: ['$driver', '$$driver'],
                          },
                          {
                            $eq: ['$from', 'Driver'],
                          },
                          {
                            $eq: ['$to', 'Vendor'],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      amount: 1,
                    },
                  },
                ],
                as: 'driverpayments',
              },
            },
            {
              $unwind: {
                path: '$driverpayments',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$_id',
                given: { $sum: '$driverpayments.amount' },
                name: { $first: '$name' },
              },
            },
          ],
          today: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(driver),
              },
            },
            {
              $project: {
                name: 1,
                vendor: 1,
              },
            },
            {
              $lookup: {
                from: 'driverpayments',
                let: {
                  vendor: '$vendor',
                  driver: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$vendor', '$$vendor'],
                          },
                          {
                            $eq: ['$driver', '$$driver'],
                          },
                          {
                            $eq: ['$from', 'Customer'],
                          },
                          {
                            $eq: ['$to', 'Driver'],
                          },
                          {
                            $eq: [
                              '$date',
                              new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                new Date().getDate()
                              ),
                            ],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      amount: 1,
                    },
                  },
                ],
                as: 'driverpayments',
              },
            },
            {
              $unwind: {
                path: '$driverpayments',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$_id',
                received: { $sum: '$driverpayments.amount' },
                name: { $first: '$name' },
              },
            },
          ],
        },
      },
    ]);
    const payments = driverPayments[0].received.map(el => {
      const givenRes = driverPayments[0].given.filter(
        ele => ele._id.toString() === el._id.toString()
      )[0];
      const todayRes = driverPayments[0].today.filter(
        ele => ele._id.toString() === el._id.toString()
      )[0];
      return {
        _id: el._id,
        name: el.name,
        received: el.received,
        given: givenRes.given,
        today: todayRes.received,
      };
    });
    return successfulRequest(res, 200, {
      payments,
    });
  }),
};

module.exports = paymentController;
