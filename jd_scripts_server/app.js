'use strict';
const { buildEnv } = require('./app/common/utils');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    buildEnv();
  }
}

module.exports = AppBootHook;
