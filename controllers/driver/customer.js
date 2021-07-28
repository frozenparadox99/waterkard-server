const mongoose = require('mongoose');
const Driver = require('../../models/driverModel');
const Customer = require('../../models/customerModel');
const CustomerProduct = require('../../models/customerProductModel');
const DailyInventory = require('../../models/dailyInventoryModel');
const DailyJarAndPayment = require('../../models/dailyJarAndPaymentModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const customerController = {
  getCustomers: catchAsync(async (req, res, next) => {
    const { driver } = req.query;
    const page = parseInt(req.query.page || 1, 10);
    const skip = (page - 1) * 20;
    const limit = 20;
    const driverDoc = await Driver.findById(driver, { group: 1 });
    const customerMatchStage = {
      $match: {
        group: mongoose.Types.ObjectId(driverDoc.group),
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
                group: 1,
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
                preserveNullAndEmptyArrays: true,
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
          groups: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                group: 1,
              },
            },
            {
              $lookup: {
                from: 'groups',
                let: {
                  group: '$group',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$group'],
                      },
                    },
                  },
                  {
                    $project: {
                      name: 1,
                    },
                  },
                ],
                as: 'group',
              },
            },
            {
              $unwind: {
                path: '$group',
                preserveNullAndEmptyArrays: false,
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
          mobileNumbers: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                group: 1,
                mobileNumber: 1,
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
          ],
          addresses: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                group: 1,
                address: 1,
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
          ],
        },
      },
    ]);
    const customersFinal = customers[0].deposits.map(el => {
      let details = customers[0].customers.filter(
        ele => ele._id.toString() === el._id.toString()
      )[0];
      const groupRes =
        customers[0].groups.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.group?.name || '';
      const mobileRes =
        customers[0].mobileNumbers.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.mobileNumber || undefined;
      const addressRes =
        customers[0].addresses.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.address || undefined;
      if (!details) {
        details = {
          totalEmptyCollected: 0,
          totalSold: 0,
        };
      }
      details.group = groupRes;
      details.mobileNumber = mobileRes;
      details.address = addressRes;
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
  getCustomerDetails: catchAsync(async (req, res, next) => {
    const { driver } = req.query;
    const driverDoc = await Driver.findById(driver, { group: 1 });
    if (!driverDoc) {
      return next(new APIError('This driver does not exist', 400));
    }
    const customers = await Customer.find({ group: driverDoc.group });
    return successfulRequest(res, 200, { customers });
  }),
};

module.exports = customerController;
