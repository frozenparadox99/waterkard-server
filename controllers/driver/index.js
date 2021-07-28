const authController = require('./auth');
const customerController = require('./customer');
const vendorController = require('../vendor');

const driverController = {
  login: authController.login,
  getCustomers: customerController.getCustomers,
  getCustomerDetails: customerController.getCustomerDetails,
  getDriverPayments: vendorController.getDriverPaymentsByDriver,
};

module.exports = driverController;
