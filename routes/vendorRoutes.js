const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor');
const vendorValidators = require('../middlewares/validators/vendor');

router.post(
  '/auth/register',
  vendorValidators.registerVendor,
  vendorController.registerVendor
);

module.exports = router;
