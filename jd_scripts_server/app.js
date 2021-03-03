'use strict';
const { createEnv } = require('./app/common/utils');
const fs = require('fs');
const path = require('path');

const appEnv = require('../config/env');
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  // 创建日志目录
  createLogs() {
    const SCRIPTS_LOGS = this.app.config.SCRIPTS_LOGS;
    if (!fs.existsSync(SCRIPTS_LOGS)) {
      fs.mkdir(SCRIPTS_LOGS, { recursive: true }, err => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`${SCRIPTS_LOGS}创建成功`);
      });
    }
  }

  // 配置scripts项目的文件
  createEnv() {
    const EnvFile = path.join(this.app.baseDir, 'env.json');
    const EnvFileBak = path.join(this.app.baseDir, 'env.json.bak');
    createEnv(EnvFileBak, EnvFile);
  }

  configWillLoad() {
    this.createLogs();
    // 创建env.json
    this.createEnv();
  }

  async didLoad() {
    // 创建.env
    // buildEnv();
  }

  // 应用启动完成
  async serverDidReady() {
    const ctx = await this.app.createAnonymousContext();
    if (this.app.config.LXK9301_installed) {
      // 创建cron.json
      ctx.service.cron.initCron();
    }

    if (appEnv.INSTALL_SCRIPTS_ON_START === 'true') {
      ctx.service.scripts.update();
    }
  }
}

module.exports = AppBootHook;
