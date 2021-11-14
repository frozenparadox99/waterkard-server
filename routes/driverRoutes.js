const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver');
const driverPaymentValidators = require('../middlewares/validators/driverPayment');
const driverValidators = require('../middlewares/validators/driver');

router.post('/login', driverValidators.login, driverController.login);

router.get(
  '/customers',
  driverValidators.getCustomers,
  driverController.getCustomers
);

router.get(
  '/customers/details',
  driverValidators.getCustomerDetails,
  driverController.getCustomerDetails
);

router.get(
  '/payments',
  driverPaymentValidators.getDriverPaymentsByDriver,
  driverController.getDriverPayments
);

module.exports = router;
