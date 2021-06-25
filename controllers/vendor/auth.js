const mongoose = require('mongoose');
const Vendor = require('../../models/vendorModel');
const Driver = require('../../models/driverModel');
const Group = require('../../models/groupModel');
const TotalInventory = require('../../models/totalInventoryModel');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const authController = {
  registerVendor: catchAsync(async (req, res, next) => {
    const {
      coolJarStock,
      bottleJarStock,
      defaultGroupName,
      firstDriverName,
      firstDriverMobileNumber,
      fullBusinessName,
      fullVendorName,
      mobileNumber,
      country,
      city,
      state,
      brandName,
    } = req.body;

    const session = await mongoose.startSession();

    session.startTransaction();

    let vendor;

    try {
      vendor = await Vendor.create(
        [
          {
            defaultGroupName,
            firstDriverName,
            firstDriverMobileNumber,
            fullBusinessName,
            fullVendorName,
            brandName,
            mobileNumber,
            country,
            city,
            state,
          },
        ],
        { session }
      );

      // console.log(vendor);

      const group = await Group.create(
        [
          {
            name: defaultGroupName,
            description: 'Please Enter the Description',
            vendor: vendor[0]._id,
            customers: [],
          },
        ],
        { session }
      );

      const driver = await Driver.create(
        [
          {
            name: firstDriverName,
            mobileNumber: firstDriverMobileNumber,
            vendor: vendor[0]._id,
            group: group[0]._id,
          },
        ],
        { session }
      );

      const currDate = new Date(new Date().toDateString());

      const totalInventory = await TotalInventory.create(
        [
          {
            vendor: vendor[0]._id,
            stock: [
              {
                coolJarStock,
                bottleJarStock,
                dateAdded: currDate,
              },
            ],
            removedStock: [
              {
                coolJarStock: 0,
                bottleJarStock: 0,
                dateAdded: currDate,
              },
            ],
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
      return next(new APIError('Failed to create vendor', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, { vendor: { _id: vendor[0]._id } });
  }),
  getVendor: catchAsync(async (req, res, next) => {
    const { mobileNumber } = req.query;
    const vendor = await Vendor.findOne(
      { mobileNumber },
      {
        fullVendorName: 1,
      }
    );
    if (!vendor) {
      return next(
        new APIError('This vendor does not exist. Please register first', 400)
      );
    }
    return successfulRequest(res, 200, { vendor });
  }),
  getHomeScreen: catchAsync(async (req, res, next) => {
    const { vendor } = req.query;
    const home = await Vendor.aggregate([
      {
        $facet: {
          totalOrders: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(vendor),
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
            {
              $lookup: {
                from: 'orders',
                let: {
                  vendor: mongoose.Types.ObjectId(vendor),
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$vendor', '$$vendor'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      vendor: 1,
                    },
                  },
                ],
                as: 'orders',
              },
            },
            {
              $unwind: {
                path: '$orders',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$_id',
                totalOrders: { $sum: 1 },
              },
            },
          ],
          totalCustomers: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(vendor),
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
            {
              $lookup: {
                from: 'customers',
                let: {
                  vendor: mongoose.Types.ObjectId(vendor),
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$vendor', '$$vendor'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      vendor: 1,
                    },
                  },
                ],
                as: 'customers',
              },
            },
            {
              $unwind: {
                path: '$customers',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$_id',
                totalCustomers: { $sum: 1 },
              },
            },
          ],
          missingJars: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(vendor),
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
            {
              $lookup: {
                from: 'dailyinventories',
                let: {
                  vendor: mongoose.Types.ObjectId(vendor),
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$vendor', '$$vendor'] },
                          { $eq: ['$completed', true] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      vendor: 1,
                      unloadReturned18: 1,
                      unloadReturned20: 1,
                      unloadEmpty18: 1,
                      unloadEmpty20: 1,
                      expectedReturned18: 1,
                      expectedReturned20: 1,
                      expectedEmpty18: 1,
                      expectedEmpty20: 1,
                      completed: true,
                    },
                  },
                ],
                as: 'dailyinventories',
              },
            },
            {
              $unwind: {
                path: '$dailyinventories',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$_id',
                totalUnload18: { $sum: '$dailyinventories.unloadReturned18' },
                totalEmpty18: { $sum: '$dailyinventories.unloadEmpty18' },
                totalUnload20: { $sum: '$dailyinventories.unloadReturned20' },
                totalEmpty20: { $sum: '$dailyinventories.unloadEmpty20' },
                totalExpectedUnload18: {
                  $sum: '$dailyinventories.expectedReturned18',
                },
                totalExpectedEmpty18: {
                  $sum: '$dailyinventories.expectedEmpty18',
                },
                totalExpectedUnload20: {
                  $sum: '$dailyinventories.expectedReturned20',
                },
                totalExpectedEmpty20: {
                  $sum: '$dailyinventories.expectedEmpty20',
                },
              },
            },
          ],
          drivers: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(vendor),
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
            {
              $lookup: {
                from: 'drivers',
                let: {
                  vendor: mongoose.Types.ObjectId(vendor),
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$vendor', '$$vendor'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      group: 1,
                      mobileNumber: 1,
                    },
                  },
                ],
                as: 'drivers',
              },
            },
            {
              $unwind: {
                path: '$drivers',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $lookup: {
                from: 'groups',
                let: {
                  group: '$drivers.group',
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
                      _id: 1,
                      name: 1,
                    },
                  },
                ],
                as: 'groups',
              },
            },
            {
              $unwind: {
                path: '$groups',
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
          vendorName: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(vendor),
              },
            },
            {
              $project: {
                _id: 1,
                fullVendorName: 1,
              },
            },
          ],
        },
      },
    ]);
    if ((home[0].vendorName?.length || 0) <= 0) {
      return next(new APIError('This vendor does not exist', 400));
    }
    home[0].drivers = {
      total: home[0].drivers.length,
      details: home[0].drivers.map(el => ({
        ...el.drivers,
        group: el.groups.name,
      })),
    };
    if ((home[0].totalOrders?.length || 0) <= 0) {
      home[0].totalOrders = 0;
    }
    if ((home[0].totalCustomers?.length || 0) <= 0) {
      home[0].totalCustomers = 0;
    }
    if ((home[0].missingJars?.length || 0) <= 0) {
      home[0].missingJars = 0;
    }
    if (home[0].totalOrders !== 0) {
      home[0].totalOrders = home[0].totalOrders[0].totalOrders;
    }
    if (home[0].totalCustomers !== 0) {
      home[0].totalCustomers = home[0].totalCustomers[0].totalCustomers;
    }
    if (home[0].missingJars !== 0) {
      home[0].missingJars =
        (home[0].missingJars[0].totalExpectedUnload18 || 0) +
        (home[0].missingJars[0].totalExpectedUnload20 || 0) +
        (home[0].missingJars[0].totalExpectedEmpty18 || 0) +
        (home[0].missingJars[0].totalExpectedEmpty20 || 0) -
        ((home[0].missingJars[0].totalUnload18 || 0) +
          (home[0].missingJars[0].totalUnload20 || 0) +
          (home[0].missingJars[0].totalEmpty18 || 0) +
          (home[0].missingJars[0].totalEmpty20 || 0));
      if (home[0].missingJars < 0) {
        home[0].missingJars = 0;
      }
    }
    home[0].vendorName = home[0].vendorName[0].fullVendorName;
    return successfulRequest(res, 200, { home: home[0] });
  }),
};

module.exports = authController;
