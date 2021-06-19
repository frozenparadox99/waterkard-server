const mongoose = require('mongoose');
const dateHelpers = require('../../helpers/date.helpers');
const TotalInventory = require('../../models/totalInventoryModel');
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
            el.coolJarStock += coolJarStock;
            el.bottleJarStock += bottleJarStock;
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
      return next(new APIError('Failed to create inventory', 401));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
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
        return next(new APIError('Can not remove more cool jar stock', 400));
      }

      if (bottleJarsNetAdded < bottleJarsNetRemoved + bottleJarStock) {
        return next(new APIError('Can not remove more bottle jar stock', 400));
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
};

module.exports = inventoryController;
