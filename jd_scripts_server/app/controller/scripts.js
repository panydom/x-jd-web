'use strict';

const Controller = require('egg').Controller;

const booleanMap = new Map([
  [ 'true', true ],
  [ 'false', false ],
]);

class ScriptsController extends Controller {
  async list() {
    const { app, ctx } = this;

    ctx.body = await this.service.scripts.list();
  }

  async getEnvFile() {
    this.ctx.body = await this.service.scripts.getEnvFile();
  }
  async postEnvFile() {
    const data = this.ctx.request.body;
    this.ctx.body = await this.service.scripts.postEnvFile(data);
  }

  async task() {
    this.ctx.body = await this.service.scripts.getTask();
  }
  async runScript() {
    const { scriptName, run } = this.ctx.query;
    this.ctx.body = await this.service.scripts.runScript(scriptName, booleanMap.get(run));
  }

  // 获取日志
  async getLog() {
    const { id } = this.ctx.query;
    this.ctx.body = await this.service.scripts.getLog(id);
  }

}

module.exports = ScriptsController;
