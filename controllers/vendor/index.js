const authController = require('./auth');
const customerController = require('./customer');
const groupController = require('./group');
const driverController = require('./driver');
const orderController = require('./order');
const inventoryController = require('./inventory');
const paymentController = require('./payment');

const controller = {
  registerVendor: authController.registerVendor,
  getVendor: authController.getVendor,
  getHomeScreen: authController.getHomeScreen,
  registerCustomer: customerController.registerCustomer,
  addCustomerProduct: customerController.addCustomerProduct,
  addCustomerPayment: paymentController.addCustomerPayment,
  getCustomers: customerController.getCustomers,
  addGroup: groupController.addGroup,
  addDriver: driverController.addDriver,
  addTransaction: driverController.addTransaction,
  addOrder: orderController.addOrder,
  addTotalInventory: inventoryController.addTotalInventory,
  removeTotalInventory: inventoryController.removeTotalInventory,
  loadDailyInventory: inventoryController.loadDailyInventory,
  unloadDailyInventory: inventoryController.unloadDailyInventory,
  getExpectedUnload: inventoryController.getExpectedUnload,
  getGroupsForVendor: groupController.getGroupsForVendor,
  getGroupDetails: groupController.getGroupDetails,
  getDriversForVendor: driverController.getDriversForVendor,
  getDriverDetails: driverController.getDriverDetails,
  getCustomerProducts: customerController.getCustomerProducts,
  getAllOrders: orderController.getAllOrders,
};

module.exports = controller;
