const authController = require('./auth');
const customerController = require('./customer');
const groupController = require('./group');
const driverController = require('./driver');
const orderController = require('./order');
const inventoryController = require('./inventory');

const controller = {
  registerVendor: authController.registerVendor,
  registerCustomer: customerController.registerCustomer,
  addCustomerProduct: customerController.addCustomerProduct,
  addGroup: groupController.addGroup,
  addDriver: driverController.addDriver,
  addTransaction: driverController.addTransaction,
  addOrder: orderController.addOrder,
  addTotalInventory: inventoryController.addTotalInventory,
  removeTotalInventory: inventoryController.removeTotalInventory,
  loadDailyInventory: inventoryController.loadDailyInventory,
  unloadDailyInventory: inventoryController.unloadDailyInventory,
  getExpectedUnload: inventoryController.getExpectedUnload,
};

module.exports = controller;
