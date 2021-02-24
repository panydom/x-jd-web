'use strict';

const Controller = require('egg').Controller;

class CronController extends Controller {
  async file() {
    this.ctx.body = await this.service.cron.file();
  }
}

module.exports = CronController;
