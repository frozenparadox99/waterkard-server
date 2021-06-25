const mongoose = require('mongoose');
const TotalInventory = require('../../models/totalInventoryModel');
const DailyInventory = require('../../models/dailyInventoryModel');
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

        await currInv.save();
      } else {
        console.log('here');
        currInv.stock.push({
          coolJarStock,
          bottleJarStock,
          dateAdded: parsedDate.data,
        });

        await currInv.save();
      }

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
  removeTotalInventory: catchAsync(async (req, res, next) => {
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

        await currInv.save();
      } else {
        console.log('here');
        currInv.removedStock.push({
          coolJarStock,
          bottleJarStock,
          dateAdded: parsedDate.data,
        });

        await currInv.save();
      }

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
      return next(new APIError('Failed to remove total inventory stock', 401));
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
    await DailyInventory.create({
      vendor,
      driver,
      load18,
      load20,
      date: date.data,
    });
    return successfulRequest(res, 201, {});
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
    const dailyInventory = await DailyInventory.findOneAndUpdate(
      { vendor, driver, date: date.data, completed: false },
      {
        unloadReturned18,
        unloadReturned20,
        unloadEmpty18,
        unloadEmpty20,
        completed: true,
      },
      {
        new: true,
      }
    );
    if (!dailyInventory) {
      return next(
        new APIError(
          'Either daily inventory record does not exist or it has already been unloaded',
          400
        )
      );
    }
    return successfulRequest(res, 200, {});
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
      return next(new APIError('This inventory does not exist', 400));
    }
    const sold18 = expected[0]?.totalSold?.filter(el => el._id === '18L');
    const expectedReturned18 =
      expected[0].load[0]?.load18 - (sold18[0]?.totalSoldJars || 0) ||
      undefined;
    const sold20 = expected[0]?.totalSold?.filter(el => el._id === '20L');
    const expectedReturned20 =
      expected[0].load[0]?.load20 - (sold20[0]?.totalSoldJars || 0) ||
      undefined;
    const empty18 = expected[0]?.totalEmpty?.filter(el => el._id === '18L');
    const expectedEmpty18 = empty18[0]?.totalEmptyCollected || undefined;
    const empty20 = expected[0]?.totalEmpty?.filter(el => el._id === '20L');
    const expectedEmpty20 = empty20[0]?.totalEmptyCollected || undefined;
    const obj = {
      expectedReturned18,
      expectedReturned20,
      expectedEmpty18,
      expectedEmpty20,
    };
    for (const prop in obj) {
      if (!obj[prop]) {
        delete obj[prop];
      }
    }
    await DailyInventory.updateOne(
      { vendor, driver, date: date.data },
      {
        ...obj,
      }
    );
    return successfulRequest(res, 200, {
      expectedReturned18: expectedReturned18 || 0,
      expectedReturned20: expectedReturned18 || 0,
      expectedEmpty18: expectedReturned18 || 0,
      expectedEmpty20: expectedReturned18 || 0,
    });
  }),
};

module.exports = inventoryController;
