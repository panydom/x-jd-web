/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
const fs = require('fs');
const { requireJSON } = require('../app/common/utils');

const bannedList = requireJSON(path.join(__dirname, './banned_list.json'));
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const { baseDir } = appInfo;
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '1euuuc6s4_1994';

  config.static = {
    prefix: '/',
  };
  // add your middleware config here
  config.middleware = [];
  config.security = {
    csrf: {
      headerName: 'x-csrf-token',
      // useSession: true,
      // cookieName: 'csrfToken',
      // sessionName: 'csrfToken',
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    scriptsDir: path.join(baseDir, '../node_modules/LXK9301'),
    bannedList,
    LXK9301_installed: fs.existsSync(path.join(baseDir, '../node_modules/LXK9301', 'README.md')),
    SCRIPTS_LOGS: path.join(baseDir, 'scripts/logs'),
  };

  return {
    ...config,
    ...userConfig,
  };
};
