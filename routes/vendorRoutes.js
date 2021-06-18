const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor');
const vendorValidators = require('../middlewares/validators/vendor');
const customerValidators = require('../middlewares/validators/customer');
const customerProductValidators = require('../middlewares/validators/customerProduct');
const groupValidators = require('../middlewares/validators/group');
const driverValidators = require('../middlewares/validators/driver');
const orderValidators = require('../middlewares/validators/order');

router.post(
  '/auth/register',
  vendorValidators.registerVendor,
  vendorController.registerVendor
);

router.post(
  '/customer',
  customerValidators.registerCustomer,
  vendorController.registerCustomer
);

router.post(
  '/customer/add-product',
  customerProductValidators.addCustomerProduct,
  vendorController.addCustomerProduct
);

router.post('/group', groupValidators.addGroup, vendorController.addGroup);

router.post('/driver', driverValidators.addDriver, vendorController.addDriver);

router.post('/order', orderValidators.addOrder, vendorController.addOrder);

module.exports = router;
