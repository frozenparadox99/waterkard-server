const auth = require('./auth');
const customer = require('./customer');
const group = require('./group');
const driver = require('./driver');

const controller = {
  registerVendor: auth.registerVendor,
  registerCustomer: customer.registerCustomer,
  addCustomerProduct: customer.addCustomerProduct,
  addGroup: group.addGroup,
  addDriver: driver.addDriver,
};

module.exports = controller;
