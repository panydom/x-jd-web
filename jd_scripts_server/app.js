'use strict';
const { buildEnv } = require('./app/common/utils');
const fs = require('fs');
const path = require('path');
const execa = require('execa');

const appEnv = require('./config/env');
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  // 创建日志目录
  createLogs() {
    const SCRIPTS_LOGS = path.join(this.app.baseDir, 'scripts/logs');
    if (!fs.existsSync(SCRIPTS_LOGS)) {
      fs.mkdir(SCRIPTS_LOGS, { recursive: true }, err => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`${SCRIPTS_LOGS}创建成功`);
      });
    }
    this.app.config.SCRIPTS_LOGS = SCRIPTS_LOGS;
  }

  // 配置scripts项目的文件
  createEnv() {
    const EnvFile = path.join(this.app.baseDir, 'env.json');
    if (!fs.existsSync(EnvFile)) {
      const EnvFileBak = path.join(this.app.baseDir, 'env.json.bak');
      execa('cp', [ EnvFileBak, EnvFile ]);
    }
  }

  configWillLoad() {
    this.app.config.LXK9301_installed = fs.existsSync(path.join(this.app.baseDir, '../node_modules/LXK9301', 'README.md'));
    this.createLogs();
    if (this.app.config.LXK9301_installed) {
      // 创建env.json
      this.createEnv();
    }
  }

  async didLoad() {
    // 创建.env
    buildEnv();
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
