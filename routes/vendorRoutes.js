const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor');
const vendorValidators = require('../middlewares/validators/vendor');
const customerValidators = require('../middlewares/validators/customer');
const customerProductValidators = require('../middlewares/validators/customerProduct');
const groupValidators = require('../middlewares/validators/group');
const driverValidators = require('../middlewares/validators/driver');
const orderValidators = require('../middlewares/validators/order');
const totalInventoryValidators = require('../middlewares/validators/totalInventory');

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

router.post('/driver/add-transaction', vendorController.addTransaction);

router.post('/order', orderValidators.addOrder, vendorController.addOrder);

router.post(
  '/inventory/total-add-stock',
  totalInventoryValidators.addTotalInventory,
  vendorController.addTotalInventory
);

router.post(
  '/inventory/total-remove-stock',
  totalInventoryValidators.removeTotalInventory,
  vendorController.removeTotalInventory
);

router.post('/inventory/daily-load', vendorController.loadDailyInventory);

router.post('/inventory/daily-unload', vendorController.unloadDailyInventory);

router.get(
  '/inventory/get-expected-unload',
  vendorController.getExpectedUnload
);

module.exports = router;
