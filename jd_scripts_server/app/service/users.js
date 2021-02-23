'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const execa = require('execa');
const Writeable = require('stream').Writable;
const Response = require('../common/Response.js');
const { buildEnv } = require('../common/utils.js');


class UserService extends Service {
  async getUsers() {
    const file = path.join(this.config.baseDir, 'env.json');
    const envFile = require(file);
    return new Response(envFile[0].fields[0].value);
  }
  // 获取登陆二维码
  // 调用getJDCookie.js
  getJDCookie() {
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

  writeCookie(cookie) {
    const file = path.join(this.config.baseDir, 'env.json');
    const envFile = require(file);
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
      fs.writeFile(file, JSON.stringify(envFile, null, ' '), () => {
        buildEnv();
        console.log('Cookie写入成功');
      });
    }
  }

  async addCookie(cookie) {
    if (cookie) {
      this.service.users.writeCookie(cookie);
      return new Response(true);
    }
    return new Response(false);
  }
}

module.exports = UserService;
