const mongoose = require('mongoose');
const TotalInventory = require('../../models/totalInventoryModel');
const DailyInventory = require('../../models/dailyInventoryModel');
const DailyJarAndPayment = require('../../models/dailyJarAndPaymentModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const inventoryController = {
  addTotalInventory: catchAsync(async (req, res, next) => {
    const { coolJarStock, bottleJarStock, dateAdded, vendor } = req.body;
    const parsedDate = dateHelpers.createDateFromString(dateAdded);
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const currInv = await TotalInventory.findOne(
        { vendor },
        'vendor stock removedStock',
        { session }
      );
      console.log(currInv);

      const existingStock = currInv.stock.filter(
        el => el.dateAdded.getTime() === parsedDate.data.getTime()
      );

      console.log(existingStock);

      if (existingStock.length > 0) {
        currInv.stock.forEach(el => {
          console.log('------------------------------------');
          console.log(el);
          if (el.dateAdded.getTime() === parsedDate.data.getTime()) {
            el.coolJarStock += parseInt(coolJarStock, 10);
            el.bottleJarStock += parseInt(bottleJarStock, 10);
          }
        });
      } else {
        console.log('here');
        currInv.stock.push({
          coolJarStock,
          bottleJarStock,
          dateAdded: parsedDate.data,
        });
      }
      currInv.godownCoolJarStock += parseInt(coolJarStock, 10);
      currInv.godownBottleJarStock += parseInt(bottleJarStock, 10);
      currInv.totalStock +=
        parseInt(coolJarStock, 10) + parseInt(bottleJarStock, 10);
      await currInv.save();
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
      return next(new APIError('Failed to add total inventory stock', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
  getTotalInventory: catchAsync(async (req, res, next) => {
    const { vendor } = req.query;
    const totalInventory = await TotalInventory.findOne({ vendor });

    return successfulRequest(res, 201, { totalInventory });
  }),
  updateTotalInventory: catchAsync(async (req, res, next) => {}),
  removeTotalInventory: catchAsync(async (req, res, next) => {
    const { coolJarStock, bottleJarStock, dateAdded, vendor } = req.body;
    const parsedDate = dateHelpers.createDateFromString(dateAdded);
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const currInv = await TotalInventory.findOne({ vendor }, null, {
        session,
      });
      const coolJarsNetAdded = currInv.stock.reduce(
        (accumulator, currValue) => accumulator + currValue.coolJarStock,
        0
      );

      const bottleJarsNetAdded = currInv.stock.reduce(
        (accumulator, currValue) => accumulator + currValue.bottleJarStock,
        0
      );

      const coolJarsNetRemoved = currInv.removedStock.reduce(
        (accumulator, currValue) => accumulator + currValue.coolJarStock,
        0
      );

      const bottleJarsNetRemoved = currInv.removedStock.reduce(
        (accumulator, currValue) => accumulator + currValue.bottleJarStock,
        0
      );

      if (coolJarsNetAdded < coolJarsNetRemoved + coolJarStock) {
        return next(new APIError('Cannot remove more cool jar stock', 400));
      }

      if (bottleJarsNetAdded < bottleJarsNetRemoved + bottleJarStock) {
        return next(new APIError('Cannot remove more bottle jar stock', 400));
      }

      const existingStock = currInv.removedStock.filter(
        el => el.dateAdded.getTime() === parsedDate.data.getTime()
      );

      if (existingStock.length > 0) {
        currInv.removedStock.forEach(el => {
          if (el.dateAdded.getTime() === parsedDate.data.getTime()) {
            el.coolJarStock += coolJarStock;
            el.bottleJarStock += bottleJarStock;
          }
        });
      } else {
        currInv.removedStock.push({
          coolJarStock,
          bottleJarStock,
          dateAdded: parsedDate.data,
        });
      }
      if (currInv.missingCoolJars > 0) {
        if (coolJarStock > currInv.missingCoolJars) {
          currInv.godownCoolJarStock -=
            parseInt(coolJarStock, 10) - currInv.missingCoolJars;
          currInv.missingCoolJars = 0;
        } else if (coolJarStock === currInv.missingCoolJars) {
          currInv.missingCoolJars = 0;
        } else {
          currInv.misingCoolJars -= parseInt(coolJarStock, 10);
        }
        currInv.totalStock -= parseInt(coolJarStock, 10);
      } else {
        currInv.godownCoolJarStock -= parseInt(coolJarStock, 10);
        currInv.totalStock -= parseInt(coolJarStock, 10);
      }
      if (currInv.missingBottleJars > 0) {
        if (bottleJarStock > currInv.missingBottleJars) {
          currInv.godownBottleJarStock -=
            parseInt(bottleJarStock, 10) - currInv.missingBottleJars;
          currInv.missingBottleJars = 0;
        } else if (bottleJarStock === currInv.missingBottleJars) {
          currInv.missingBottleJars = 0;
        } else {
          currInv.misingBottleJars -= parseInt(bottleJarStock, 10);
        }
        currInv.totalStock -= parseInt(bottleJarStock, 10);
      } else {
        currInv.godownBottleJarStock -= parseInt(bottleJarStock, 10);
        currInv.totalStock -= parseInt(bottleJarStock, 10);
      }
      await currInv.save();

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
      return next(new APIError('Failed to remove total inventory stock', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
  loadDailyInventory: catchAsync(async (req, res, next) => {
    const { vendor, driver, load18, load20, date: stringDate } = req.body;
    const date = dateHelpers.createDateFromString(stringDate);
    if (!date.success) {
      return next(new APIError('Invalid date', 400));
    }
    const existingInventory = await DailyInventory.findOne({
      vendor,
      driver,
      date: date.data,
    });
    if (existingInventory) {
      return next(
        new APIError(
          'Daily inventory for this driver and date already exists',
          400
        )
      );
    }
    const session = await mongoose.startSession();

    session.startTransaction();
    try {
      const totalInv = await TotalInventory.findOne({ vendor }, null, {
        session,
      });
      if (!totalInv) {
        return next(
          new APIError(
            'Inventory does not exist for this vendor. Please create it first',
            400
          )
        );
      }
      if (load18 > totalInv.godownCoolJarStock) {
        return next(
          new APIError(
            'You cannot load more cool jars than available in godown',
            400
          )
        );
      }
      if (load20 > totalInv.godownBottleJarStock) {
        return next(
          new APIError(
            'You cannot load more bottle jars than available in godown',
            400
          )
        );
      }
      await DailyInventory.create(
        [
          {
            vendor,
            driver,
            load18,
            load20,
            date: date.data,
          },
        ],
        { session }
      );
      totalInv.godownCoolJarStock -= parseInt(load18, 10);
      totalInv.godownBottleJarStock -= parseInt(load20, 10);
      await totalInv.save();
      await session.commitTransaction();
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      return next(new APIError('Failed to load daily inventory', 500));
    }
    return successfulRequest(res, 201, {});
  }),
  getDailyInventory: catchAsync(async (req, res, next) => {
    const { vendor, date } = req.query;
    const parsedDate = dateHelpers.createDateFromString(date);
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }
    const dailyInv = await DailyInventory.find({
      vendor,
      date: parsedDate.data,
    }).populate('driver');

    return successfulRequest(res, 201, { dailyInv });
  }),
  unloadDailyInventory: catchAsync(async (req, res, next) => {
    const {
      vendor,
      driver,
      unloadReturned18,
      unloadReturned20,
      unloadEmpty18,
      unloadEmpty20,
      date: stringDate,
    } = req.body;
    const date = dateHelpers.createDateFromString(stringDate);
    if (!date.success) {
      return next(new APIError('Invalid date', 400));
    }
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const totalInv = await TotalInventory.findOne({ vendor }, null, {
        session,
      });
      if (!totalInv) {
        return next(
          new APIError('Inventory does not exist for this vendor', 400)
        );
      }
      const dailyInventory = await DailyInventory.findOne(
        {
          vendor,
          driver,
          date: date.data,
          completed: false,
        },
        null,
        { session }
      );
      if (!dailyInventory) {
        return next(
          new APIError(
            'Either daily inventory record does not exist or it has already been unloaded',
            400
          )
        );
      }
      const dailyJarAndPayment = await DailyJarAndPayment.findOne(
        {
          vendor,
          driver,
          date: date.data,
          completed: false,
        },
        null,
        { session }
      );
      if (
        Number.isNaN(parseInt(dailyInventory.expectedReturned18, 10)) ||
        Number.isNaN(parseInt(dailyInventory.expectedReturned20, 10)) ||
        Number.isNaN(parseInt(dailyInventory.expectedEmpty18, 10)) ||
        Number.isNaN(parseInt(dailyInventory.expectedEmpty20, 10))
      ) {
        return next(
          new APIError('Please get expected jars for this inventory first', 400)
        );
      }
      dailyInventory.unloadReturned18 = unloadReturned18;
      dailyInventory.unloadReturned20 = unloadReturned20;
      dailyInventory.unloadEmpty18 = unloadEmpty18;
      dailyInventory.unloadEmpty20 = unloadEmpty20;
      dailyInventory.missingReturned18 =
        dailyInventory.expectedReturned18 - unloadReturned18;
      dailyInventory.missingReturned20 =
        dailyInventory.expectedReturned20 - unloadReturned20;
      dailyInventory.missingEmpty18 =
        dailyInventory.expectedEmpty18 - unloadEmpty18;
      dailyInventory.missingEmpty20 =
        dailyInventory.expectedEmpty20 - unloadEmpty20;
      dailyInventory.completed = true;
      totalInv.godownCoolJarStock +=
        parseInt(dailyInventory.unloadReturned18, 10) +
        parseInt(dailyInventory.unloadEmpty18, 10);
      totalInv.godownBottleJarStock +=
        parseInt(dailyInventory.unloadReturned20, 10) +
        parseInt(dailyInventory.unloadEmpty20, 10);
      totalInv.missingCoolJars +=
        parseInt(dailyInventory.missingReturned18, 10) +
        parseInt(dailyInventory.missingEmpty18, 10);
      totalInv.missingBottleJars +=
        parseInt(dailyInventory.missingReturned20, 10) +
        parseInt(dailyInventory.missingEmpty20, 10);
      dailyJarAndPayment.completed = true;
      await dailyJarAndPayment.save();
      await dailyInventory.save();
      await totalInv.save();
      await session.commitTransaction();
    } catch (err) {
      console.log(err);
      return next(
        new APIError('Could not unload daily inventory. Please try again', 500)
      );
    }
    return successfulRequest(res, 200, {});
  }),
  updateUnload: catchAsync(async (req, res, next) => {
    const {
      vendor,
      driver,
      unloadReturned18,
      unloadReturned20,
      unloadEmpty18,
      unloadEmpty20,
      date: stringDate,
    } = req.body;
    const date = dateHelpers.createDateFromString(stringDate);
    if (!date.success) {
      return next(new APIError('Invalid date', 400));
    }
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const dailyInventory = await DailyInventory.findOne({
        vendor,
        driver,
        date: date.data,
        completed: true,
      });
      if (!dailyInventory) {
        return next(
          new APIError(
            'Either daily inventory record does not exist or it has not been unloaded',
            400
          )
        );
      }
      if (
        Number.isNaN(parseInt(dailyInventory.expectedReturned18, 10)) ||
        Number.isNaN(parseInt(dailyInventory.expectedReturned20, 10)) ||
        Number.isNaN(parseInt(dailyInventory.expectedEmpty18, 10)) ||
        Number.isNaN(parseInt(dailyInventory.expectedEmpty20, 10))
      ) {
        return next(
          new APIError('Please get expected jars for this inventory first', 400)
        );
      }
      dailyInventory.unloadReturned18 =
        unloadReturned18 || dailyInventory.unloadReturned18;
      dailyInventory.unloadReturned20 =
        unloadReturned20 || dailyInventory.unloadReturned20;
      dailyInventory.unloadEmpty18 =
        unloadEmpty18 || dailyInventory.unloadEmpty18;
      dailyInventory.unloadEmpty20 =
        unloadEmpty20 || dailyInventory.unloadEmpty20;
      dailyInventory.missingReturned18 =
        dailyInventory.expectedReturned18 -
        (unloadReturned18 || dailyInventory.unloadReturned18);
      dailyInventory.missingReturned20 =
        dailyInventory.expectedReturned20 -
        (unloadReturned20 || dailyInventory.unloadReturned20);
      dailyInventory.missingEmpty18 =
        dailyInventory.expectedEmpty18 -
        (unloadEmpty18 || dailyInventory.unloadEmpty18);
      dailyInventory.missingEmpty20 =
        dailyInventory.expectedEmpty20 -
        (unloadEmpty20 || dailyInventory.unloadEmpty20);
      dailyInventory.completed = true;
      await dailyInventory.save();
      await session.commitTransaction();
    } catch (err) {
      return next(
        new APIError('Could not update daily inventory. Please try again', 500)
      );
    }
    return successfulRequest(res, 200, { message: 'Daily inventory updated' });
  }),
  getDailyJarAndPayment: catchAsync(async (req, res, next) => {
    const { id, vendor, driver, date: stringDate } = req.query;
    if (id) {
      const dailyJarAndPayment = await DailyJarAndPayment.findById(id);
      if (!dailyJarAndPayment) {
        return next(new APIError('Entry not found', 400));
      }
      return successfulRequest(res, 200, { dailyJarAndPayment });
    }
    const date = dateHelpers.createDateFromString(stringDate);
    if (!date.success) {
      return next(new APIError('Invalid date', 400));
    }
    const dailyJarAndPayment = await DailyJarAndPayment.findOne({
      vendor,
      driver,
      date: date.data,
    });
    if (!dailyJarAndPayment) {
      return next(new APIError('Entry not found', 400));
    }
    return successfulRequest(res, 200, { dailyJarAndPayment });
  }),
  getExpectedUnload: catchAsync(async (req, res, next) => {
    const { vendor, driver, date: stringDate } = req.query;
    const date = dateHelpers.createDateFromString(stringDate);
    if (!date.success) {
      return next(new APIError('Invalid date', 400));
    }
    const dailyInv = await DailyInventory.findOne({
      vendor: mongoose.Types.ObjectId(vendor),
      driver: mongoose.Types.ObjectId(driver),
      date: date.data,
      completed: true,
    });
    if (dailyInv) {
      const {
        expectedReturned18,
        expectedReturned20,
        expectedEmpty18,
        expectedEmpty20,
      } = dailyInv;
      return successfulRequest(res, 200, {
        expectedReturned18,
        expectedReturned20,
        expectedEmpty18,
        expectedEmpty20,
      });
    }
    const dailyInventory = await DailyInventory.findOne({
      vendor: mongoose.Types.ObjectId(vendor),
      driver: mongoose.Types.ObjectId(driver),
      date: date.data,
      completed: false,
    });
    if (!dailyInventory) {
      return next(new APIError('This inventory does not exist', 400));
    }
    // load inventory -> deliver to customers -> unload inventory
    // deliver to customers -> sell filled jars and/or collect empty jars
    // load - sold + empty = in vehicles
    // 20 - 10 + 5 => 15
    const expected = await DailyInventory.aggregate([
      {
        $facet: {
          totalEmpty: [
            {
              $match: {
                vendor: mongoose.Types.ObjectId(vendor),
                driver: mongoose.Types.ObjectId(driver),
                date: date.data,
                completed: false,
              },
            },
            {
              $lookup: {
                from: 'dailyjarandpayments',
                let: {
                  date: '$date',
                  vendor: '$vendor',
                  driver: '$driver',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$vendor', '$$vendor'] },
                          { $eq: ['$driver', '$$driver'] },
                          { $eq: ['$date', '$$date'] },
                        ],
                      },
                    },
                  },
                ],
                as: 'jarAndPayment',
              },
            },
            {
              $unwind: {
                path: '$jarAndPayment',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $unwind: {
                path: '$jarAndPayment.transactions',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$jarAndPayment.transactions.product',
                totalEmptyCollected: {
                  $sum: '$jarAndPayment.transactions.emptyCollected',
                },
              },
            },
          ],
          totalSold: [
            {
              $match: {
                vendor: mongoose.Types.ObjectId(vendor),
                driver: mongoose.Types.ObjectId(driver),
                date: date.data,
              },
            },
            {
              $lookup: {
                from: 'dailyjarandpayments',
                let: {
                  date: '$date',
                  vendor: '$vendor',
                  driver: '$driver',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$vendor', '$$vendor'] },
                          { $eq: ['$driver', '$$driver'] },
                          { $eq: ['$date', '$$date'] },
                        ],
                      },
                    },
                  },
                ],
                as: 'jarAndPayment',
              },
            },
            {
              $unwind: {
                path: '$jarAndPayment',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $unwind: {
                path: '$jarAndPayment.transactions',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$jarAndPayment.transactions.product',
                totalSoldJars: {
                  $sum: '$jarAndPayment.transactions.soldJars',
                },
              },
            },
          ],
          load: [
            {
              $match: {
                vendor: mongoose.Types.ObjectId(vendor),
                driver: mongoose.Types.ObjectId(driver),
                date: date.data,
              },
            },
            {
              $project: {
                load18: 1,
                load20: 1,
              },
            },
          ],
        },
      },
    ]);
    if (
      expected.length === 0 ||
      !expected[0].load ||
      expected[0].load.length === 0
    ) {
      const obj = {
        expectedReturned18: dailyInventory.load18,
        expectedReturned20: dailyInventory.load20,
        expectedEmpty18: 0,
        expectedEmpty20: 0,
      };
      await DailyInventory.updateOne(
        { vendor, driver, date: date.data, completed: false },
        {
          ...obj,
        }
      );
      return successfulRequest(res, 200, {
        ...obj,
      });
    }
    const sold18 = expected[0]?.totalSold?.filter(el => el._id === '18L');
    const expectedReturned18 =
      expected[0].load[0]?.load18 - (sold18[0]?.totalSoldJars || 0) || 0;
    const sold20 = expected[0]?.totalSold?.filter(el => el._id === '20L');
    const expectedReturned20 =
      expected[0].load[0]?.load20 - (sold20[0]?.totalSoldJars || 0) || 0;
    const empty18 = expected[0]?.totalEmpty?.filter(el => el._id === '18L');
    const expectedEmpty18 = empty18[0]?.totalEmptyCollected || 0;
    const empty20 = expected[0]?.totalEmpty?.filter(el => el._id === '20L');
    const expectedEmpty20 = empty20[0]?.totalEmptyCollected || 0;
    const obj = {
      expectedReturned18,
      expectedReturned20,
      expectedEmpty18,
      expectedEmpty20,
    };
    await DailyInventory.updateOne(
      { vendor, driver, date: date.data, completed: false },
      {
        ...obj,
      }
    );
    return successfulRequest(res, 200, {
      ...obj,
    });
  }),
  getDailyInventoryStatus: catchAsync(async (req, res, next) => {
    const { vendor, date, driver } = req.query;
    const parsedDate = dateHelpers.createDateFromString(date);
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }
    const dailyInv = await DailyInventory.findOne({
      vendor,
      date: parsedDate.data,
      driver,
    });
    if (!dailyInv) {
      return next(new APIError('Daily inventory does not exist', 400));
    }
    const obj = {
      stage1: (dailyInv.load18 || 0) + (dailyInv.load20 || 0),
      stage2: {
        present:
          !Number.isNaN(parseInt(dailyInv.expectedReturned18, 10)) &&
          !Number.isNaN(parseInt(dailyInv.expectedReturned20, 10)) &&
          !Number.isNaN(parseInt(dailyInv.expectedEmpty18, 10)) &&
          !Number.isNaN(parseInt(dailyInv.expectedEmpty20, 10)),
        empty: dailyInv.expectedEmpty18 + dailyInv.expectedEmpty20,
        filled: dailyInv.expectedReturned18 + dailyInv.expectedReturned20,
      },
      stage3: {
        present: dailyInv.completed,
        empty: dailyInv.unloadEmpty18 + dailyInv.unloadEmpty20,
        filled: dailyInv.unloadReturned18 + dailyInv.unloadReturned20,
      },
    };
    obj.stage4 = {
      present: obj.stage2.present && obj.stage3.present,
      empty:
        dailyInv.missingEmpty18 + dailyInv.missingEmpty20 ||
        obj.stage2.empty - obj.stage3.empty,
      filled:
        dailyInv.missingReturned18 + dailyInv.missingReturned20 ||
        obj.stage2.filled - obj.stage3.filled,
    };
    return successfulRequest(res, 200, obj);
  }),
  getDailyTransactionsByCustomer: catchAsync(async (req, res, next) => {
    const { vendor, customer } = req.query;
    const page = parseInt(req.query.page || 1, 10);
    const skip = (page - 1) * 10;
    const limit = 10;
    const transactions = await DailyJarAndPayment.aggregate([
      {
        $match: {
          vendor: mongoose.Types.ObjectId(vendor),
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
      {
        $unwind: {
          path: '$transactions',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'transactions.customer': mongoose.Types.ObjectId(customer),
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          transaction: '$transactions',
          date: 1,
        },
      },
    ]);
    return successfulRequest(res, 200, {
      transactions,
      final: transactions.length < limit,
    });
  }),
  updateDailyTransaction: catchAsync(async (req, res, next) => {
    const { jarAndPayment, transaction, soldJars, emptyCollected } = req.body;
    const dailyJarAndPayment = await DailyJarAndPayment.findById(jarAndPayment);
    if (!dailyJarAndPayment) {
      return next(new APIError('Entry not found', 400));
    }
    const dailyInventory = await DailyInventory.findOne({
      vendor: dailyJarAndPayment.vendor,
      driver: dailyJarAndPayment.driver,
      date: dailyJarAndPayment.date,
    });
    if (!dailyInventory) {
      return next(new APIError('Daily inventory not found', 400));
    }
    const transactionInd = dailyJarAndPayment.transactions.findIndex(
      el => el._id.toString() === transaction
    );
    const actualTransaction = dailyJarAndPayment.transactions[transactionInd];
    if (actualTransaction.length === 0) {
      return next(new APIError('Transaction not found', 400));
    }
    if (actualTransaction[0].status === 'skipped') {
      return next(
        new APIError('Transaction was skipped and cannot be edited', 400)
      );
    }
    if (soldJars) {
      actualTransaction.soldJars = soldJars;
    }
    if (emptyCollected) {
      actualTransaction.emptyCollected = emptyCollected;
    }
    dailyJarAndPayment.transactions[transactionInd] = actualTransaction;
    await dailyJarAndPayment.save();
    if (dailyInventory.completed) {
      let sold18 = 0;
      let sold20 = 0;
      let empty18 = 0;
      let empty20 = 0;
      dailyJarAndPayment.transactions.forEach(el => {
        if (el.product === '18L') {
          sold18 += +(el.soldJars || 0);
          empty18 += +(el.emptyCollected || 0);
        }
        if (el.product === '20L') {
          sold20 += +(el.soldJars || 0);
          empty20 += +(el.emptyCollected || 0);
        }
      });
      dailyInventory.expectedReturned18 = dailyInventory.load18 - sold18;
      dailyInventory.expectedReturned20 = dailyInventory.load20 - sold20;
      dailyInventory.expectedEmpty18 = empty18;
      dailyInventory.expectedEmpty20 = empty20;
      dailyInventory.missingReturned18 =
        dailyInventory.expectedReturned18 - dailyInventory.unloadReturned18;
      dailyInventory.missingReturned20 =
        dailyInventory.expectedReturned20 - dailyInventory.unloadReturned20;
      dailyInventory.missingEmpty18 =
        dailyInventory.expectedEmpty18 - dailyInventory.unloadEmpty18;
      dailyInventory.missingEmpty20 =
        dailyInventory.expectedEmpty20 - dailyInventory.unloadEmpty20;
      await dailyInventory.save();
    }
    return successfulRequest(res, 200, { message: 'Transaction updated' });
  }),
};

module.exports = inventoryController;
