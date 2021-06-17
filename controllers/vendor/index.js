const auth = require('./auth');
const customer = require('./customer');

const controller = {
  registerVendor: auth.registerVendor,
  registerCustomer: customer.registerCustomer,
  addCustomerProduct: customer.addCustomerProduct,
};

module.exports = controller;
