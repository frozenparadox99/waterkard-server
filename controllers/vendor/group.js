const mongoose = require('mongoose');
const Group = require('../../models/groupModel');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const groupController = {
  addGroup: catchAsync(async (req, res, next) => {
    const { name, description, vendor } = req.body;

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const group = await Group.create(
        [
          {
            name,
            description,
            vendor,
            customers: [],
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
      return next(new APIError('Failed to create vendor', 401));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
};

module.exports = groupController;
