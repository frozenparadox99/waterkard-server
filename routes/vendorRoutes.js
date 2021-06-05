const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor');

router.post('/auth/register', vendorController.registerVendor);

module.exports = router;
