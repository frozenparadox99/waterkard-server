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

    try {
      const vendor = await Vendor.create(
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

    return successfulRequest(res, 201, {});
  }),
};

module.exports = authController;
