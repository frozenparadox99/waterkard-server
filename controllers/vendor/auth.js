const { db } = require('../../utils/firebase');
const APIError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const { successfulRequest } = require('../../utils/responses');

const auth = {
  registerVendor: catchAsync(async (req, res, next) => {
    const {
      coolJarStock,
      bottleJarStock,
      defaultGroupName,
      firstDriverName,
      firstDriverPhoneNumber,
      fullBusinessName,
      fullVendorName,
      mobileNumber,
      country,
      city,
      state,
    } = req.body;
    let { brandName } = req.body;
    brandName = brandName.trim();
    const requiredKeys = [
      coolJarStock,
      bottleJarStock,
      defaultGroupName,
      firstDriverName,
      firstDriverPhoneNumber,
      fullBusinessName,
      fullVendorName,
      brandName,
      mobileNumber,
      country,
      city,
      state,
    ];
    if (requiredKeys.filter(el => !el).length > 0) {
      return next(new APIError('Incomplete data for vendor', 400));
    }
    const vendorRef = await db
      .collection('vendors')
      .add({
        defaultGroupName,
        firstDriverName,
        firstDriverPhoneNumber,
        fullBusinessName,
        fullVendorName,
        brandName,
        mobileNumber,
        country,
        city,
        state,
      })
      .then(doc => doc.get());
    const driverRef = await db
      .collection('drivers')
      .add({
        name: firstDriverName,
        phoneNumber: firstDriverPhoneNumber,
        group: defaultGroupName,
        vendor: vendorRef.id,
      })
      .then(doc => doc.get());
    const totalInventoryRef = await db
      .collection('totalInventories')
      .add({
        coolJarStock,
        bottleJarStock,
        vendor: vendorRef.id,
      })
      .then(doc => doc.get());
    const groupRef = await db
      .collection('groups')
      .add({
        groupName: defaultGroupName,
        description: '',
        default: true,
        vendor: vendorRef.id,
      })
      .then(doc => doc.get());
    const productRef = await db
      .collection('products')
      .add({
        litres18jar: `${brandName} - 18 L Cool Jar`,
        litres20jar: `${brandName} - 20 L Bottle Jar`,
        price18jar: 60,
        price20jar: 50,
        vendor: vendorRef.id,
      })
      .then(doc => doc.get());
    const vendor = vendorRef.data();
    return successfulRequest(res, 201, {
      message: 'Vendor created',
      vendor: {
        ...vendor,
        id: vendorRef.id,
        group: groupRef.id,
        driver: driverRef.id,
        product: productRef.id,
        totalInventory: totalInventoryRef.id,
      },
    });
  }),
};

module.exports = auth;
