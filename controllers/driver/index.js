const authController = require('./auth');

const driverController = {
  login: authController.login,
};

module.exports = driverController;
