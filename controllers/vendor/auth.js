const mongoose = require('mongoose');
const { db } = require('../../utils/firebase');
const APIError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const Vendor = require('../../models/vendorModel');
const Driver = require('../../models/driverModel');
const Group = require('../../models/groupModel');
const TotalInventory = require('../../models/totalInventoryModel');

const { successfulRequest } = require('../../utils/responses');

const auth = {
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
        { session: session }
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
        { session: session }
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
        { session: session }
      );

      const totalInventory = await TotalInventory.create(
        [
          {
            vendor: vendor[0]._id,
            stock: [
              {
                coolJarStock,
                bottleJarStock,
                dateAdded: Date.now(),
              },
            ],
          },
        ],
        { session: session }
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

    // const vendorRef = await db
    //   .collection('vendors')
    //   .add({
    //     defaultGroupName,
    //     firstDriverName,
    //     firstDriverPhoneNumber,
    //     fullBusinessName,
    //     fullVendorName,
    //     brandName,
    //     mobileNumber,
    //     country,
    //     city,
    //     state,
    //   })
    //   .then(doc => doc.get());
    // const driverRef = await db
    //   .collection('drivers')
    //   .add({
    //     name: firstDriverName,
    //     phoneNumber: firstDriverPhoneNumber,
    //     group: defaultGroupName,
    //     vendor: vendorRef.id,
    //   })
    //   .then(doc => doc.get());
    // const totalInventoryRef = await db
    //   .collection('totalInventories')
    //   .add({
    //     coolJarStock,
    //     bottleJarStock,
    //     vendor: vendorRef.id,
    //   })
    //   .then(doc => doc.get());
    // const groupRef = await db
    //   .collection('groups')
    //   .add({
    //     groupName: defaultGroupName,
    //     description: '',
    //     default: true,
    //     vendor: vendorRef.id,
    //   })
    //   .then(doc => doc.get());
    // const productRef = await db
    //   .collection('products')
    //   .add({
    //     litres18jar: `${brandName} - 18 L Cool Jar`,
    //     litres20jar: `${brandName} - 20 L Bottle Jar`,
    //     price18jar: 60,
    //     price20jar: 50,
    //     vendor: vendorRef.id,
    //   })
    //   .then(doc => doc.get());
    // const vendor = vendorRef.data();
    return successfulRequest(res, 201, {});
  }),
};

module.exports = auth;
