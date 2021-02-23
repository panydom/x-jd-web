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

  async task() {
    this.ctx.body = await this.service.scripts.getTask();
  }
  async runScript() {
    const { scriptName, run } = this.ctx.query;
    this.ctx.body = await this.service.scripts.runScript(scriptName, booleanMap.get(run));
  }

}

module.exports = ScriptsController;
