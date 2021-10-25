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
  getVendorById: authController.getVendorById,
  updateVendor: authController.updateVendor,
  getHomeScreen: authController.getHomeScreen,
  getStockDetails: authController.getStockDetails,
  registerCustomer: customerController.registerCustomer,
  updateCustomer: customerController.updateCustomer,
  updateCustomersGroups: customerController.updateCustomersGroups,
  addCustomerProduct: customerController.addCustomerProduct,
  getCustomers: customerController.getCustomers,
  getCustomer: customerController.getCustomer,
  getCustomersByOrderDate: customerController.getCustomersByDate,
  getCustomerProducts: customerController.getCustomerProducts,
  getCustomerDeposits: customerController.getCustomerDeposits,
  getCustomerPayment: paymentController.getCustomerPayment,
  addCustomerPayment: paymentController.addCustomerPayment,
  addDriverPayment: paymentController.addDriverPayment,
  getDriverPayments: paymentController.getDriverPayments,
  getDriverToVendorPayment: paymentController.getDriverToVendorPayment,
  getDriverPaymentsByDriver: paymentController.getDriverPaymentsByDriver,
  getCustomerInvoice: paymentController.getCustomerInvoice,
  addGroup: groupController.addGroup,
  addDriver: driverController.addDriver,
  addTransaction: driverController.addTransaction,
  addOrder: orderController.addOrder,
  addTotalInventory: inventoryController.addTotalInventory,
  removeTotalInventory: inventoryController.removeTotalInventory,
  loadDailyInventory: inventoryController.loadDailyInventory,
  unloadDailyInventory: inventoryController.unloadDailyInventory,
  getExpectedUnload: inventoryController.getExpectedUnload,
  getDailyInventoryStatus: inventoryController.getDailyInventoryStatus,
  getGroupsForVendor: groupController.getGroupsForVendor,
  getGroupDetails: groupController.getGroupDetails,
  getDriversForVendor: driverController.getDriversForVendor,
  getDriverDetails: driverController.getDriverDetails,
  getDriverData: driverController.getDriverData,
  getAllOrders: orderController.getAllOrders,
  getTotalInventory: inventoryController.getTotalInventory,
  getDailyInventory: inventoryController.getDailyInventory,
  getDailyJarAndPayment: inventoryController.getDailyJarAndPayment,
  getDailyTransactionsByCustomer:
    inventoryController.getDailyTransactionsByCustomer,
  updateDailyTransaction: inventoryController.updateDailyTransaction,
  updateUnload: inventoryController.updateUnload,
};

module.exports = controller;
