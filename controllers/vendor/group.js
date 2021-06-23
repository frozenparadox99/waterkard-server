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
      return next(new APIError('Failed to create group', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
  getGroupsForVendor: catchAsync(async (req, res, next) => {
    const { vendor } = req.query;
    const groups = await Group.find({
      vendor,
    });
    if (!groups || groups.length === 0) {
      return next(new APIError('No groups found for the vendor', 400));
    }

    return successfulRequest(res, 201, { groups });
  }),
  getGroupDetails: catchAsync(async (req, res, next) => {
    const { groupId } = req.query;
    const group = await Group.findById(groupId).populate({
      path: 'customers',
      populate: { path: 'customer' },
    });
    if (!group) {
      return next(new APIError('No group found for the given Id', 400));
    }

    return successfulRequest(res, 201, { group });
  }),
};

module.exports = groupController;
