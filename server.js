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
const server = app.listen(process.env.PORT || 4000, () =>
  console.log(chalk.cyanBright(`Server up on port ${process.env.PORT || 4000}`))
);

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason.name, reason.message);
  console.table('Server shutting down due to uncaught rejection');
  server.close(() => {
    // eslint-disable-next-line
    process.exit(1);
  });
});

process.on('uncaughtException', (err, origin) => {
  console.log(err.name, err.message);
  console.table('Server shutting down due to uncaught exception');
  server.close(() => {
    // eslint-disable-next-line
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('Shutting down due to SIGTERM');
  server.close(() => {
    console.log('Process terminated');
  });
});
