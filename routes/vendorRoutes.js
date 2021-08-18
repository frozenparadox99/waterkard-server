const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor');
const vendorValidators = require('../middlewares/validators/vendor');
const customerValidators = require('../middlewares/validators/customer');
const customerProductValidators = require('../middlewares/validators/customerProduct');
const groupValidators = require('../middlewares/validators/group');
const driverValidators = require('../middlewares/validators/driver');
const orderValidators = require('../middlewares/validators/order');
const inventoryValidators = require('../middlewares/validators/inventory');
const customerPaymentValidators = require('../middlewares/validators/customerPayment');
const driverPaymentValidators = require('../middlewares/validators/driverPayment');

router.get('/', vendorValidators.getVendor, vendorController.getVendor);

router.get(
  '/home',
  vendorValidators.getHomeScreen,
  vendorController.getHomeScreen
);

router.post(
  '/auth/register',
  vendorValidators.registerVendor,
  vendorController.registerVendor
);

router
  .route('/customer')
  .post(customerValidators.registerCustomer, vendorController.registerCustomer)
  .patch(vendorController.updateCustomer)
  .get(customerValidators.getCustomers, vendorController.getCustomers);

router.patch('/customer/groups', vendorController.updateCustomersGroups);

router.get(
  '/customers-by-date',
  customerValidators.getCustomersByDate,
  vendorController.getCustomersByOrderDate
);

router
  .route('/customer/payment')
  .get(vendorController.getCustomerPayment)
  .post(
    customerPaymentValidators.addCustomerPayment,
    vendorController.addCustomerPayment
  );

router.post(
  '/customer/add-product',
  customerProductValidators.addCustomerProduct,
  vendorController.addCustomerProduct
);

router.get(
  '/customer/products/all',
  customerValidators.getCustomerProducts,
  vendorController.getCustomerProducts
);

router.get(
  '/customer/deposits',
  customerValidators.getCustomerDeposits,
  vendorController.getCustomerDeposits
);

router
  .post('/group', groupValidators.addGroup, vendorController.addGroup)
  .get(vendorController.getGroupDetails);
router.get(
  '/group/all',
  groupValidators.getGroupsForVendor,
  vendorController.getGroupsForVendor
);

router
  .post('/driver', driverValidators.addDriver, vendorController.addDriver)
  .get(vendorController.getDriverDetails);
router.get('/driver/all', vendorController.getDriversForVendor);

router.post(
  '/driver/add-transaction',
  driverValidators.addTransaction,
  vendorController.addTransaction
);

router.post(
  '/driver/payment',
  driverPaymentValidators.addDriverPayment,
  vendorController.addDriverPayment
);

router.get(
  '/driver/payments',
  driverPaymentValidators.getDriverPayments,
  vendorController.getDriverPayments
);

router.get('/driver/paymentList', vendorController.getDriverToVendorPayment);

router.post('/order', orderValidators.addOrder, vendorController.addOrder);
router.get('/order/all', vendorController.getAllOrders);

router.post(
  '/inventory/total-add-stock',
  inventoryValidators.addTotalInventory,
  vendorController.addTotalInventory
);

router.post(
  '/inventory/total-remove-stock',
  inventoryValidators.removeTotalInventory,
  vendorController.removeTotalInventory
);

router.get('/inventory/total', vendorController.getTotalInventory);

router.post(
  '/inventory/daily-load',
  inventoryValidators.loadDailyInventory,
  vendorController.loadDailyInventory
);

router.get('/inventory/daily', vendorController.getDailyInventory);

router.get(
  '/inventory/daily-status',
  inventoryValidators.getDailyInventoryStatus,
  vendorController.getDailyInventoryStatus
);

router.get(
  '/inventory/daily-jar-payment',
  inventoryValidators.getDailyJarAndPayment,
  vendorController.getDailyJarAndPayment
);

router
  .route('/inventory/daily-unload')
  .post(
    inventoryValidators.unloadDailyInventory,
    vendorController.unloadDailyInventory
  )
  .patch(inventoryValidators.updateUnload, vendorController.updateUnload);

router.get(
  '/inventory/get-expected-unload',
  inventoryValidators.getExpectedUnload,
  vendorController.getExpectedUnload
);

router
  .route('/transactions')
  .get(
    inventoryValidators.getDailyTransactionsByCustomer,
    vendorController.getDailyTransactionsByCustomer
  )
  .patch(
    inventoryValidators.updateDailyTransaction,
    vendorController.updateDailyTransaction
  );

module.exports = router;
