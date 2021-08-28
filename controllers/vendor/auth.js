const mongoose = require('mongoose');
const Vendor = require('../../models/vendorModel');
const Driver = require('../../models/driverModel');
const Group = require('../../models/groupModel');
const TotalInventory = require('../../models/totalInventoryModel');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');
const dateHelpers = require('../../helpers/date.helpers');

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
                  vendor: '$_id',
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
                  vendor: '$_id',
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
                  vendor: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$vendor', '$$vendor'] },
                          { $eq: ['$completed', true] },
                          {
                            $or: [
                              { $ne: ['$missingReturned18', 0] },
                              { $ne: ['$missingReturned20', 0] },
                              { $ne: ['$missingEmpty18', 0] },
                              { $ne: ['$missingEmpty20', 0] },
                            ],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      vendor: 1,
                      missingReturned18: 1,
                      missingReturned20: 1,
                      missingEmpty18: 1,
                      missingEmpty20: 1,
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
                totalMissingReturned18: {
                  $sum: '$dailyinventories.missingReturned18',
                },
                totalMissingReturned20: {
                  $sum: '$dailyinventories.missingReturned20',
                },
                totalMissingEmpty18: {
                  $sum: '$dailyinventories.missingEmpty18',
                },
                totalMissingEmpty20: {
                  $sum: '$dailyinventories.missingEmpty20',
                },
              },
            },
          ],
          totalJars: [
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
                from: 'totalinventories',
                let: {
                  vendor: '$_id',
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
                      stock: 1,
                      removedStock: 1,
                    },
                  },
                ],
                as: 'totalinventories',
              },
            },
            {
              $unwind: {
                path: '$totalinventories',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $addFields: {
                totalCoolJarStock: {
                  $sum: '$totalinventories.stock.coolJarStock',
                },
                totalBottleJarStock: {
                  $sum: '$totalinventories.stock.bottleJarStock',
                },
                totalRemovedCoolJarStock: {
                  $sum: '$totalinventories.removedStock.coolJarStock',
                },
                totalRemovedBottleJarStock: {
                  $sum: '$totalinventories.removedStock.bottleJarStock',
                },
              },
            },
            {
              $project: {
                totalCoolJarStock: 1,
                totalBottleJarStock: 1,
                totalRemovedCoolJarStock: 1,
                totalRemovedBottleJarStock: 1,
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
    if ((home[0].totalJars?.length || 0) <= 0) {
      home[0].totalJars = 0;
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
    if (home[0].totalJars !== 0) {
      home[0].totalJars =
        (home[0].totalJars[0]?.totalCoolJarStock || 0) +
        (home[0].totalJars[0]?.totalBottleJarStock || 0) -
        ((home[0].totalJars[0]?.totalRemovedCoolJarStock || 0) +
          (home[0].totalJars[0]?.totalRemovedBottleJarStock || 0));
    }
    if (home[0].missingJars !== 0) {
      home[0].missingJars =
        (home[0].missingJars[0]?.totalMissingReturned18 || 0) +
        (home[0].missingJars[0]?.totalMissingReturned20 || 0) +
        (home[0].missingJars[0]?.totalMissingEmpty18 || 0) +
        (home[0].missingJars[0]?.totalMissingEmpty20 || 0);
      if (home[0].missingJars < 0) {
        home[0].missingJars = 0;
      }
    }
    home[0].vendorName = home[0].vendorName[0].fullVendorName;
    return successfulRequest(res, 200, { home: home[0] });
  }),
  getStockDetails: catchAsync(async (req, res, next) => {
    const { vendor, date: stringDate } = req.query;
    const date = dateHelpers.createDateFromString(
      stringDate ||
        `${new Date().getDate()}/${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()}`
    );
    if (!date.success) {
      return new APIError('Invalid date', 400);
    }
    const totalInventory = await TotalInventory.findOne({ vendor });
    if (!totalInventory) {
      return next(
        new APIError(
          'Inventory does not exist for this vendor. Please create it first',
          400
        )
      );
    }
    const home = await Vendor.aggregate([
      {
        $facet: {
          // missingJars: [
          //   {
          //     $match: {
          //       _id: mongoose.Types.ObjectId(vendor),
          //     },
          //   },
          //   {
          //     $project: {
          //       _id: 1,
          //     },
          //   },
          //   {
          //     $lookup: {
          //       from: 'dailyinventories',
          //       let: {
          //         vendor: '$_id',
          //       },
          //       pipeline: [
          //         {
          //           $match: {
          //             $expr: {
          //               $and: [
          //                 { $eq: ['$vendor', '$$vendor'] },
          //                 { $eq: ['$completed', true] },
          //                 {
          //                   $or: [
          //                     { $ne: ['$missingReturned18', 0] },
          //                     { $ne: ['$missingReturned20', 0] },
          //                     { $ne: ['$missingEmpty18', 0] },
          //                     { $ne: ['$missingEmpty20', 0] },
          //                   ],
          //                 },
          //               ],
          //             },
          //           },
          //         },
          //         {
          //           $project: {
          //             _id: 1,
          //             vendor: 1,
          //             missingReturned18: 1,
          //             missingReturned20: 1,
          //             missingEmpty18: 1,
          //             missingEmpty20: 1,
          //             completed: true,
          //           },
          //         },
          //       ],
          //       as: 'dailyinventories',
          //     },
          //   },
          //   {
          //     $unwind: {
          //       path: '$dailyinventories',
          //       preserveNullAndEmptyArrays: false,
          //     },
          //   },
          //   {
          //     $group: {
          //       _id: '$_id',
          //       totalMissingReturned18: {
          //         $sum: '$dailyinventories.missingReturned18',
          //       },
          //       totalMissingReturned20: {
          //         $sum: '$dailyinventories.missingReturned20',
          //       },
          //       totalMissingEmpty18: {
          //         $sum: '$dailyinventories.missingEmpty18',
          //       },
          //       totalMissingEmpty20: {
          //         $sum: '$dailyinventories.missingEmpty20',
          //       },
          //     },
          //   },
          // ],
          loadedJars: [
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
                  vendor: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$vendor', '$$vendor'] },
                          { $eq: ['$date', date.data] },
                          { $eq: ['$completed', false] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      vendor: 1,
                      load18: 1,
                      load20: 1,
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
                totalLoad18: {
                  $sum: '$dailyinventories.load18',
                },
                totalLoad20: {
                  $sum: '$dailyinventories.load20',
                },
              },
            },
          ],
          unloadedJars: [
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
                  vendor: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$vendor', '$$vendor'] },
                          { $eq: ['$date', date.data] },
                          { $eq: ['$completed', true] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      vendor: 1,
                      unloadEmpty18: 1,
                      unloadEmpty20: 1,
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
                totalUnloadEmpty18: {
                  $sum: '$dailyinventories.unloadEmpty18',
                },
                totalUnloadEmpty20: {
                  $sum: '$dailyinventories.unloadEmpty20',
                },
              },
            },
          ],
          soldJars: [
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
                from: 'dailyjarandpayments',
                let: {
                  vendor: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$vendor', '$$vendor'] },
                          { $eq: ['$date', date.data] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      transactions: 1,
                    },
                  },
                ],
                as: 'jarandpayments',
              },
            },
            {
              $unwind: {
                path: '$jarandpayments',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $unwind: {
                path: '$jarandpayments.transactions',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$_id',
                totalSold: {
                  $sum: '$jarandpayments.transactions.soldJars',
                },
              },
            },
          ],
          // totalJars: [
          //   {
          //     $match: {
          //       _id: mongoose.Types.ObjectId(vendor),
          //     },
          //   },
          //   {
          //     $project: {
          //       _id: 1,
          //     },
          //   },
          //   {
          //     $lookup: {
          //       from: 'totalinventories',
          //       let: {
          //         vendor: '$_id',
          //       },
          //       pipeline: [
          //         {
          //           $match: {
          //             $expr: {
          //               $eq: ['$vendor', '$$vendor'],
          //             },
          //           },
          //         },
          //         {
          //           $project: {
          //             _id: 1,
          //             vendor: 1,
          //             stock: 1,
          //             removedStock: 1,
          //           },
          //         },
          //       ],
          //       as: 'totalinventories',
          //     },
          //   },
          //   {
          //     $unwind: {
          //       path: '$totalinventories',
          //       preserveNullAndEmptyArrays: false,
          //     },
          //   },
          //   {
          //     $addFields: {
          //       totalCoolJarStock: {
          //         $sum: '$totalinventories.stock.coolJarStock',
          //       },
          //       totalBottleJarStock: {
          //         $sum: '$totalinventories.stock.bottleJarStock',
          //       },
          //       totalRemovedCoolJarStock: {
          //         $sum: '$totalinventories.removedStock.coolJarStock',
          //       },
          //       totalRemovedBottleJarStock: {
          //         $sum: '$totalinventories.removedStock.bottleJarStock',
          //       },
          //     },
          //   },
          //   {
          //     $project: {
          //       totalCoolJarStock: 1,
          //       totalBottleJarStock: 1,
          //       totalRemovedCoolJarStock: 1,
          //       totalRemovedBottleJarStock: 1,
          //     },
          //   },
          // ],
          // customerBalance: [
          //   {
          //     $match: {
          //       _id: mongoose.Types.ObjectId(vendor),
          //     },
          //   },
          //   {
          //     $project: {
          //       _id: 1,
          //     },
          //   },
          //   {
          //     $lookup: {
          //       from: 'customers',
          //       let: {
          //         vendor: '$_id',
          //       },
          //       pipeline: [
          //         {
          //           $match: {
          //             $expr: {
          //               $eq: ['$vendor', '$$vendor'],
          //             },
          //           },
          //         },
          //         {
          //           $project: {
          //             _id: 1,
          //           },
          //         },
          //       ],
          //       as: 'customers',
          //     },
          //   },
          //   {
          //     $unwind: {
          //       path: '$customers',
          //       preserveNullAndEmptyArrays: false,
          //     },
          //   },
          //   {
          //     $lookup: {
          //       from: 'customerproducts',
          //       let: {
          //         customer: '$customers._id',
          //       },
          //       pipeline: [
          //         {
          //           $match: {
          //             $expr: {
          //               $eq: ['$customer', '$$customer'],
          //             },
          //           },
          //         },
          //         {
          //           $project: {
          //             _id: 1,
          //             balanceJars: 1,
          //           },
          //         },
          //       ],
          //       as: 'customerproducts',
          //     },
          //   },
          //   {
          //     $unwind: {
          //       path: '$customerproducts',
          //       preserveNullAndEmptyArrays: false,
          //     },
          //   },
          //   {
          //     $group: {
          //       _id: '$_id',
          //       balance: {
          //         $sum: '$customerproducts.balanceJars',
          //       },
          //     },
          //   },
          // ],
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
    // if ((home[0].missingJars?.length || 0) <= 0) {
    //   home[0].missingJars = 0;
    // }
    // if (home[0].totalJars !== 0) {
    //   home[0].totalJars =
    //     (home[0].totalJars[0]?.totalCoolJarStock || 0) +
    //     (home[0].totalJars[0]?.totalBottleJarStock || 0) -
    //     ((home[0].totalJars[0]?.totalRemovedCoolJarStock || 0) +
    //       (home[0].totalJars[0]?.totalRemovedBottleJarStock || 0));
    // }
    // if (home[0].missingJars !== 0) {
    //   home[0].missingJars =
    //     (home[0].missingJars[0]?.totalMissingReturned18 || 0) +
    //     (home[0].missingJars[0]?.totalMissingReturned20 || 0) +
    //     (home[0].missingJars[0]?.totalMissingEmpty18 || 0) +
    //     (home[0].missingJars[0]?.totalMissingEmpty20 || 0);
    //   if (home[0].missingJars < 0) {
    //     home[0].missingJars = 0;
    //   }
    // }
    home[0].soldJars = home[0]?.soldJars[0]?.totalSold || 0;
    home[0].vendorName = home[0].vendorName[0].fullVendorName;
    home[0].loadedJars =
      (home[0].loadedJars[0]?.totalLoad18 || 0) +
      (home[0].loadedJars[0]?.totalLoad20 || 0);
    home[0].emptyJars =
      (home[0].unloadedJars[0]?.totalUnloadEmpty18 || 0) +
      (home[0].unloadedJars[0]?.totalUnloadEmpty20 || 0);
    home[0].missingJars =
      totalInventory.missingCoolJars + totalInventory.missingBottleJars;
    home[0].godownstock =
      totalInventory.godownCoolJarStock + totalInventory.godownBottleJarStock;
    home[0].totalStock = totalInventory.totalStock;
    home[0].customerBalance =
      totalInventory.customerCoolJarBalance +
      totalInventory.customerBottleJarBalance;
    // home[0].customersBalance = home[0].customerBalance[0]?.balance || 0;
    // delete home[0].totalEmpty;
    // delete home[0].customerBalance;
    delete home[0].unloadedJars;
    return successfulRequest(res, 200, { ...home[0] });
  }),
};

module.exports = authController;
