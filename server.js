const chalk = require('chalk');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({
  path: './config/.env',
});
const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(chalk.white.italic('Database connection established'));
  })
  .catch(err => {
    console.log(chalk.red(err));
  });

const app = require('./app');
app.listen(process.env.PORT || 4000, () =>
  console.log(chalk.cyanBright(`Server up on port ${process.env.PORT || 4000}`))
);
