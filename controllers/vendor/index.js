const auth = require('./auth');
const customer = require('./customer');
const group = require('./group');

const controller = {
  registerVendor: auth.registerVendor,
  registerCustomer: customer.registerCustomer,
  addCustomerProduct: customer.addCustomerProduct,
  addGroup: group.addGroup,
};

module.exports = controller;
