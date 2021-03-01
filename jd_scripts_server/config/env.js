'use strict';

const dotenv = require('dotenv');
const path = require('path');

const APP_ENV_FILE = path.join(__dirname, '../../', '.env');

const { parsed = {} } = dotenv.config({
  path: APP_ENV_FILE,
});

console.log('env :>> ', parsed);

module.exports = parsed;

