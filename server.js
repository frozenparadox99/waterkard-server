const chalk = require('chalk');
const dotenv = require('dotenv');
dotenv.config({
  path: './.env',
});
const app = require('./app');

app.listen(process.env.PORT || 4000, () =>
  console.log(chalk.cyanBright(`Server up on port ${process.env.PORT || 4000}`))
);
