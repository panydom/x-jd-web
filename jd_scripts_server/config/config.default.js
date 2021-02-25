/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
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
    scriptsDir: path.join(appInfo.baseDir, '../node_modules/LXK9301'),
  };

  return {
    ...config,
    ...userConfig,
  };
};
