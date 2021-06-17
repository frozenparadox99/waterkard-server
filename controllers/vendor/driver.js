const mongoose = require('mongoose');

const APIError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const Driver = require('../../models/driverModel');

const { successfulRequest } = require('../../utils/responses');

const driver = {
  addDriver: catchAsync(async (req, res, next) => {
    const { name, mobileNumber, vendor, group } = req.body;
    // 1) Find driver documents which match the group passed in req.body
    let currentDriver = await Driver.findOne({ group });
    console.log(currentDriver);

    // 2) If this document exists then raise an error because only on driver can belong to one group
    if (currentDriver) {
      return next(new APIError('One group for One driver', 401));
    }

    // 3) Continue with adding the driver

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      let driver = await Driver.create(
        [{ name, mobileNumber, vendor, group }],
        {
          session: session,
        }
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
      return next(new APIError('Failed to create vendor', 401));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
};

module.exports = driver;
