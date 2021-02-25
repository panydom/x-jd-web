'use strict';
const { buildEnv } = require('./app/common/utils');
const fs = require('fs');
const path = require('path');
const execa = require('execa');
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

  createEnv() {
    // 配置文件
    const EnvFile = path.join(this.app.baseDir, 'env.json');
    if (!fs.existsSync(EnvFile)) {
      const EnvFileBak = path.join(this.app.baseDir, 'env.json.bak');
      execa('cp', [ EnvFileBak, EnvFile ]);
    }
  }

  configWillLoad() {
    this.createLogs();
    // 创建env.json
    this.createEnv();
  }

  async didLoad() {
    // 创建.env
    buildEnv();
  }

  // 应用启动完成
  async serverDidReady() {
    const ctx = await this.app.createAnonymousContext();
    // 创建cron.json
    ctx.service.cron.initCron();
  }
}

module.exports = AppBootHook;
