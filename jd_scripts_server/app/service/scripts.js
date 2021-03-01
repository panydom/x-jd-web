'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const execa = require('execa');
const readline = require('readline');
const dotenv = require('dotenv');
const Writeable = require('stream').Writable;
const Response = require('../common/Response.js');
const os = require('os');
const { requireJSON, createEnv } = require('../common/utils.js');

class ScriptsService extends Service {
  async readFile(file) {
    try {
      const rl = readline.createInterface({
        input: fs.createReadStream(file),
      });
      const list = [];
      for await (const line of rl) {
        list.push(line);
      }
      return list;
    } catch (e) {
      return [];
    }
  }
  // 获取脚本列表
  async list() {
    const config = this.config;
    if (!config.LXK9301_installed) return new Response([]);
    try {
      // const cronList = await this.service.scripts.readFile(path.join(config.scriptsDir, 'docker/crontab_list.sh'));
      const scriptsList = await this.service.scripts.readFile(path.join(config.scriptsDir, 'README.md'));

      const list = [];
      let lock = true;
      for (const line of scriptsList) {
        if (line.includes('清单标记开始')) {
          lock = false;
          continue;
        } else if (line.includes('清单标记结束')) {
          lock = true;
        }
        if (!lock && line.includes('lxk0301')) {
          const [ index, name, title, address ] = line.slice(1, -1).split('|');
          const match = name.match(/\[(.*)\]\((.*)\)/);
          const data = {
            index,
            name,
            title,
            address,
            filename: match[1],
            filepath: match[2],
          };

          if (address && /\[(.*)\]\((.*)\)/.test(address)) {
            const addressMatch = address.match(/\[(.*)\]\((.*)\)/);
            data.address = addressMatch[2];
          }
          list.push(data);
        }
      }
      // 去除表头
      return new Response(list);
    } catch (e) {
      return new Response(null, 500, '服务端解析文件错误');
    }
  }

  async getEnvFile() {
    const { config } = this;
    const envFilePath = path.join(config.baseDir, 'env.json');
    const data = requireJSON(envFilePath);
    return new Response(data);
  }

  async postEnvFile(data) {
    await this.service.users.writeEnvFile(data);
    return new Response(true);
  }

  /**
   * 获取运行中的脚本
   */
  async getTask() {
    const taskName = (this.app.taskList || []).map(({ scriptName }) => scriptName);
    return new Response(taskName);
  }

  // 任务结束、或者手动关闭
  deleteTask(scriptName) {
    let tasks = this.app.taskList || [];
    tasks = tasks.reduce((list, task) => {
      if (task.scriptName !== scriptName) {
        list.push(task);
      } else {
        task.shell.cancel();
        task.shell = null;
      }
      return list;
    }, []);

    return tasks;
  }

  // 运行任务
  async runScript(scriptName, run = true) {
    let tasks = this.app.taskList || [];
    if (run) {
      const file = path.join(this.config.scriptsDir, scriptName);
      const logFile = path.join(this.config.SCRIPTS_LOGS, `${scriptName}.log`);
      const envFile = path.join(this.config.baseDir, '.env');
      const { parsed = {} } = dotenv.config({
        path: envFile,
      });
      const shell = execa('node', [ file ], {
        env: parsed,
        cwd: this.config.scriptsDir,
      });
      shell.stdout.on('end', () => {
        this.app.taskList = this.service.scripts.deleteTask(scriptName);
      });
      const stream = fs.createWriteStream(logFile);
      shell.stderr.pipe(stream);
      shell.stdout.pipe(stream);
      tasks.push({
        scriptName,
        shell,
      });
    } else {
      tasks = this.service.scripts.deleteTask(scriptName);
    }
    this.app.taskList = tasks;
    return this.service.scripts.getTask();
  }

  // 获取日志
  getLog(id, lineNumber = '100') {
    const logFile = path.join(this.config.SCRIPTS_LOGS, `${id}.log`);
    let content = '';
    return new Promise(resolve => {
      if (fs.existsSync(logFile)) {
        const writeStream = new Writeable({
          write(chunk, encoding, cb) {
            content += chunk.toString();
            cb();
          },
        });
        let shell;
        if (lineNumber === '0') {
          shell = execa('cat', [ logFile ]);
        } else {
          shell = execa('tail', [ '-n', lineNumber, logFile ]);
        }
        shell.stdout.pipe(writeStream);
        shell.stdout.on('close', () => {
          resolve(content);
          shell = null;
        });
      } else {
        resolve(content);
      }
    }).then(data => new Response(data));

  }

  async deleteLogs() {
    const dir = this.app.config.SCRIPTS_LOGS;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      fs.rmSync(path.join(dir, file));
    }
    return new Response(true);
  }

  // 获取脚本文件内容
  async content(filename) {
    const content = fs.readFileSync(path.join(this.config.scriptsDir, filename));
    return new Response(content.toString());
  }

  // 配置文件
  createEnv() {
    const EnvFile = path.join(this.app.baseDir, 'env.json');
    const EnvFileBak = path.join(this.app.baseDir, 'env.json.bak');
    createEnv(EnvFileBak, EnvFile)
  }

  async update() {
    return new Promise(resolve => {
      const ROOT = path.join(this.config.baseDir, '../');
      let shell = execa.command('npm run update', {
        cwd: ROOT,
        env: {
          platform: os.platform(),
        },
      });
      let installError = false;
      const logStream = fs.createWriteStream(path.join(this.config.SCRIPTS_LOGS, 'update.log'));
      shell.stdout.pipe(logStream);
      shell.stdout.once('end', () => {
        shell = null;
        if (!installError) {
          // 如果之前没有安装
          if (!this.app.config.LXK9301_installed) {
            this.app.config.LXK9301_installed = true;
            // 执行app.js中的相同处理
            this.createEnv();
            // 开启定时任务
            this.service.cron.initCron();
          }
        }
        resolve(true);
      });
      shell.stderr.pipe(logStream);

      logStream.on('data', () => {
        installError = true;
      });
      // resolve(true)
    }).then(success => new Response(success));
  }

}

module.exports = ScriptsService;
