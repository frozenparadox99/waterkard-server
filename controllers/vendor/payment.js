const mongoose = require('mongoose');
const Payment = require('../../models/paymentModel');
const CustomerPayment = require('../../models/customerPaymentModel');
const CustomerProduct = require('../../models/customerProductModel');
const Vendor = require('../../models/vendorModel');
const Customer = require('../../models/customerModel');
const Driver = require('../../models/driverModel');
const DailyJarAndPayment = require('../../models/dailyJarAndPaymentModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const paymentController = {
  addCustomerPayment: catchAsync(async (req, res, next) => {
    const {
      vendor,
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

    const parsedDate = dateHelpers.createDateFromString(stringDate);
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }
    if (from !== 'Customer' || to !== 'Vendor') {
      return next(new APIError('Invalid input', 400));
    }
    // 1) Check if customer belongs to vendor
    const customerInDb = await Customer.findOne({ _id: customer, vendor });

    if (!customerInDb) {
      return next(new APIError('This customer does not exist', 400));
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      // 4) Save payment in the Customer Payment collection
      const customerPayment = await Payment.create(
        [
          {
            vendor,
            customer,
            from,
            to,
            product,
            mode,
            amount,
            chequeDetails,
            onlineAppForPayment,
            date: parsedDate.data,
          },
        ],
        { session }
      );

      // 5) Based on the product, find and update the deposit amount

      const custProd = await CustomerProduct.findOne(
        { customer, product },
        'deposit customer product rate balanceJars dispenser balancePayment',
        { session }
      );

      custProd.balancePayment -= +amount;
      customerInDb.balancePayment -= +amount;
      await customerInDb.save();
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
  getCustomerPayments: catchAsync(async (req, res, next) => {
    const { customer, vendor } = req.query;

    if (!vendor) {
      return next(new APIError('Invalid vendor', 400));
    }
    if (!customer) {
      return next(new APIError('Invalid customer', 400));
    }

    const customerPayments = await Payment.find({
      from: 'Customer',
      customer,
      vendor,
    });
    if (!customerPayments) {
      return next(new APIError('No payments found for this customer', 400));
    }
    return successfulRequest(res, 200, { customerPayments });
  }),
  getAllCustomerPayments: catchAsync(async (req, res, next) => {
    const { vendor, driver: driverId } = req.query;
    let driver = null;
    if (driverId) {
      driver = await Driver.findById(driverId, { group: 1 });
    }
    if (!driver && driverId) {
      return next(new APIError('Driver not found', 400));
    }
    const filter = driver ? { vendor, group: driver.group } : { vendor };
    const customers = await Customer.find(
      { ...filter },
      {
        name: 1,
        mobileNumber: 1,
        balancePayment: 1,
      }
    );
    if (customers.length === 0) {
      return next(
        new APIError(
          "You don't have any customers. Please add a customer first",
          400
        )
      );
    }
    const totalBalance = customers.reduce((a, c) => a + c.balancePayment, 0);
    return successfulRequest(res, 200, {
      customers,
      totalBalance,
    });
  }),
  getCustomerInvoice: catchAsync(async (req, res, next) => {
    const {
      vendor: vendorId,
      customer: customerId,
      startDate: start,
      endDate: end,
    } = req.query;
    const startDate = dateHelpers.createDateFromString(start);
    const endDate = dateHelpers.createDateFromString(end);
    if (!startDate.success || !endDate.success) {
      return next(new APIError('Invalid date', 400));
    }
    const customer = await Customer.findById(customerId, {
      name: 1,
      mobileNumber: 1,
      address: 1,
      city: 1,
      area: 1,
      pincode: 1,
    });
    const vendor = await Vendor.findById(vendorId, {
      fullVendorName: 1,
      fullBusinessName: 1,
      fullBrandName: 1,
      brandName: 1,
      mobileNumber: 1,
      city: 1,
      state: 1,
    });
    if (!customer) {
      return next(new APIError('Customer does not exist', 400));
    }
    if (!vendor) {
      return next(new APIError('Vendor does not exist', 400));
    }
    const transactions18 = await DailyJarAndPayment.find(
      {
        date: { $gte: startDate.data, $lte: endDate.data },
        transactions: {
          $elemMatch: {
            customer: mongoose.Types.ObjectId(customerId),
            status: 'completed',
            product: '18L',
          },
        },
      },
      { date: 1, 'transactions.$': 1 }
    );
    const transactions20 = await DailyJarAndPayment.find(
      {
        date: { $gte: startDate.data, $lte: endDate.data },
        transactions: {
          $elemMatch: {
            customer: mongoose.Types.ObjectId(customerId),
            status: 'completed',
            product: '20L',
          },
        },
      },
      { date: 1, 'transactions.$': 1 }
    );
    const payments18 = transactions18.map(el => ({
      date: el.date,
      transaction: el.transactions[0],
    }));
    const payments20 = transactions20.map(el => ({
      date: el.date,
      transaction: el.transactions[0],
    }));
    const rate18 = await CustomerProduct.findOne(
      {
        customer: customerId,
        product: '18L',
      },
      { rate: 1 }
    );
    const rate20 = await CustomerProduct.findOne(
      {
        customer: customerId,
        product: '20L',
      },
      { rate: 1 }
    );
    if (
      (!rate18 && !rate20) ||
      (rate18 === null && rate20 === null) ||
      (payments18.length === 0 && payments20.length === 0)
    ) {
      return next(
        new APIError('This customer does not have any transactions', 400)
      );
    }
    return successfulRequest(res, 200, {
      vendor,
      customer,
      payments18,
      payments20,
      rate18,
      rate20,
    });
  }),
  addPayment: catchAsync(async (req, res, next) => {
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
    const currentCustomer = await Customer.findById(customer);
    if (!currentCustomer && customer) {
      return next(new APIError('Customer does not exist', 400));
    }
    const session = await mongoose.startSession();
    let payment;
    session.startTransaction();
    try {
      payment = await Payment.create(
        [
          {
            vendor,
            driver,
            customer: customer || undefined,
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
          { balancePayment: 1 },
          { session }
        );
        if (!customerProduct) {
          throw Error(
            'Please add this product for the specified customer first'
          );
        }
        customerProduct.balancePayment -= +amount;
        currentCustomer.balancePayment -= +amount;
        await currentCustomer.save();
        await customerProduct.save();
      }
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      return next(new APIError(err.message, 400));
    } finally {
      session.endSession();
    }
    return successfulRequest(res, 201, { payment });
  }),
  getDriverToVendorPayment: catchAsync(async (req, res, next) => {
    const { driver } = req.query;

    if (!driver) {
      return next(new APIError('Invalid driver', 400));
    }

    const driverPayments = await Payment.find({
      driver,
      from: 'Driver',
      to: 'Vendor',
    });

    return successfulRequest(res, 200, { driverPayments });
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
                from: 'payments',
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
                from: 'payments',
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
                from: 'payments',
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
                from: 'payments',
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
                from: 'payments',
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
                from: 'payments',
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
