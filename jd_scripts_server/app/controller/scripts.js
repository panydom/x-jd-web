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
    const { id, lineNumber } = this.ctx.query;
    this.ctx.body = await this.service.scripts.getLog(id, lineNumber);
  }

  // 删除所有日志
  async deleteLogs() {
    this.ctx.body = await this.service.scripts.deleteLogs();
  }

  // 文件内容
  async content() {
    const { filename } = this.ctx.params;
    this.ctx.body = await this.service.scripts.content(filename);
  }

  async update() {
    this.ctx.body = await this.service.scripts.update();
  }

}

module.exports = ScriptsController;
