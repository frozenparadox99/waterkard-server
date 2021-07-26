const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver');
const driverValidators = require('../middlewares/validators/driver');

router.post('/login', driverValidators.login, driverController.login);

module.exports = router;
