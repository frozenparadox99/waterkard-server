const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const app = express();

app.use(express.json());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(hpp());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello world');
});

module.exports = app;