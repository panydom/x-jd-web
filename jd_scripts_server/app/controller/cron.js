'use strict';

const Controller = require('egg').Controller;

class CronController extends Controller {
  async file() {
    this.ctx.body = await this.service.cron.file();
  }
  async saveFile() {
    const data = this.ctx.request.body;
    this.ctx.body = await this.service.cron.save(data);
  }
}

module.exports = CronController;
