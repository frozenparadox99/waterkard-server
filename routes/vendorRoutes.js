const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor');
const vendorValidators = require('../middlewares/validators/vendor');
const customerValidators = require('../middlewares/validators/customer');

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

module.exports = router;
