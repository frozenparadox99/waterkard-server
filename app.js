const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const chalk = require('chalk');
const morgan = require('morgan');
const app = express();
const vendorRoutes = require('./routes/vendorRoutes');
const errorController = require('./controllers/errorController');

app.use(
  express.json({
    inflate: true,
    limit: '10kb',
    strict: true,
  })
);
app.use(helmet());
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(hpp());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  morgan.token('time', () => chalk.bgWhite.black.bold(new Date().toString()));
  app.use(morgan('dev'));
  app.use(morgan(':time'));
}

app.use('/api/v1/vendor', vendorRoutes);

app.use('*', errorController);
module.exports = app;
