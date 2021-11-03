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
    const { driver, date } = req.query;
    const driverDoc = await Driver.findById(driver, { group: 1 });
    const parsedDate = dateHelpers.createDateFromString(date || '');
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }
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
    const customerGroupStage = {};
    if (date) {
      customerGroupStage.status = {
        $first: '$jarAndPayments.transactions.status',
      };
    }
    const props = [{ name: 'date', val: parsedDate.data }];
    if (date) {
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
                createdAt: -1,
              },
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
                ...customerGroupStage,
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
                balancePayment: 1,
                _id: 1,
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $group: {
                _id: '$_id',
                name: { $first: '$name' },
                balancePayment: { $first: '$balancePayment' },
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
                createdAt: -1,
              },
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
                createdAt: -1,
              },
            },
          ],
          balance: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                balancePayment: 1,
                _id: 1,
              },
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
      const balanceRes =
        customers[0].balance.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0].totalBalance || undefined;
      if (!details) {
        details = {
          totalEmptyCollected: 0,
          totalSold: 0,
        };
      }
      if (date && !details.status) {
        details.status = 'pending';
      }
      details.group = groupRes;
      details.mobileNumber = mobileRes;
      details.address = addressRes;
      details.totalBalance = balanceRes;
      return {
        ...el,
        ...details,
      };
    });
    const statusData = {
      pending: 1,
      skipped: 2,
      completed: 3,
    };
    customersFinal.sort((a, b) => statusData[a.status] - statusData[b.status]);
    return successfulRequest(res, 200, {
      customers: customersFinal,
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
