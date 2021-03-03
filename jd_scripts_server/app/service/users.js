'use strict';

const Service = require('egg').Service;
const path = require('path');
const execa = require('execa');
const Writeable = require('stream').Writable;
const Response = require('../common/Response.js');
const { buildEnv, writeJSONSync } = require('../common/utils.js');

class UserService extends Service {

  get jsonfile() {
    return path.join(this.config.baseDir, 'env.json');
  }

  writeEnvFile(data) {
    return new Promise(resolve => {
      writeJSONSync(this.jsonfile, data);
      buildEnv(data);
      resolve();
    });

  }

  async getUsers() {
    const envFile = require(this.jsonfile);
    return new Response(envFile[0].fields[0].value);
  }
  // 获取登陆二维码
  // 调用getJDCookie.js
  getJDCookie() {
    if (this.app.getJDCookieProcess) {
      return new Response('', 1, '当前正在扫码');
    }
    const { config } = this;
    const file = path.join(config.scriptsDir, 'getJDCookie.js');
    const writeCookie = this.service.users.writeCookie;
    return new Promise(resolve => {
      const data = [];
      const stream = new Writeable({
        decodeStrings: false,
        highWaterMark: 100,
        write: (chunk, encoding, cb) => {
          const str = chunk.toString();
          data.push(str);
          cb();
          if (str.includes('plogin.m.jd.com')) {
            resolve(str);
          } else if (str.includes('pt_key') && str.includes('pt_pin')) {
            // 登陆成功，写入json
            writeCookie(str);
          }
        },
      });
      this.app.getJDCookieProcess = execa('node', [ file ]);
      this.app.getJDCookieProcess.stdout.pipe(stream);
    }).then(data => new Response(data));
  }
  // cancelGetJDCookie
  async cancelGetJDCookie() {
    if (this.app.getJDCookieProcess) {
      this.app.getJDCookieProcess.cancel();
      this.app.getJDCookieProcess = null;
    }
    return new Response(true);
  }

  async writeCookie(cookie) {
    const envFile = require(this.jsonfile);
    const match = cookie.match(/pt_key=(.*?);pt_pin=(.*?);/);
    if (match) {
      const [ cookie, pt_key, pt_pin ] = match;
      const users = envFile[0].fields[0].value;
      const newUser = {
        cookie, pt_key, pt_pin,
        userName: pt_pin,
      };
      if (users.length === 0) {
        users.push(newUser);
      } else {
        let found = false;
        for (let i = 0; i < users.length; i++) {
          if (users[i].pt_pin === pt_pin) {
            users[i] = newUser;
            found = true;
            break;
          }
        }
        if (!found) {
          users.push(newUser);
        }
      }
      envFile[0].fields[0].value = users;
      await this.writeEnvFile(envFile);
    }
  }

  async addCookie(cookie) {
    let cookies = cookie;
    if (cookie) {
      cookies = cookie.split('&');
      for await (const cookie of cookies) {
        await this.service.users.writeCookie(cookie);
      }
      return new Response(true);
    }
    return new Response(false);
  }

  // 删除
  async deleteUser(userName) {
    const envFile = require(this.jsonfile);
    const users = envFile[0].fields[0].value;
    const newUsers = users.reduce((list, user) => {
      if (user.userName !== userName) {
        list.push(user);
      }
      return list;
    }, []);
    envFile[0].fields[0].value = newUsers;
    await this.writeEnvFile(envFile);

    return new Response(true);
  }
}

module.exports = UserService;
