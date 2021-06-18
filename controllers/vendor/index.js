const authController = require('./auth');
const customerController = require('./customer');
const groupController = require('./group');
const driverController = require('./driver');

const controller = {
  registerVendor: authController.registerVendor,
  registerCustomer: customerController.registerCustomer,
  addCustomerProduct: customerController.addCustomerProduct,
  addGroup: groupController.addGroup,
  addDriver: driverController.addDriver,
};

module.exports = controller;
