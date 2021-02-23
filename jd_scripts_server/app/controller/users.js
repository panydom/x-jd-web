'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 获取用户列表
  async getUsers() {
    this.ctx.body = await this.service.users.getUsers();
  }
  // 添加Cookie
  async addCookie() {
    const { cookie } = this.ctx.query;
    this.ctx.body = await this.service.users.addCookie(cookie);
  }


  async getQrCode() {
    this.ctx.body = await this.service.users.getJDCookie();
  }
  async cancelQrCode() {
    this.ctx.body = await this.service.users.cancelGetJDCookie();
  }

  async deleteUser() {
    const { userName } = this.ctx.query;
    this.ctx.body = await this.service.users.deleteUser(userName);
  }
}

module.exports = UserController;
