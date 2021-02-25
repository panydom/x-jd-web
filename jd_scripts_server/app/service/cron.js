'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const Response = require('../common/Response.js');
const { requireJSON } = require('../common/utils');
const BaseCron = require('../common/baseCron.js');
const CRON_INSTANCE = Symbol('CRON_INSTANCE');
class CronService extends Service {
  get customCronFile() {
    return path.join(this.app.baseDir, 'cron.json');
  }

  /**
   * 写入数据
   * @param {object} data 数据
   */
  saveFile(data) {
    return new Promise(resolve => {
      fs.writeFile(this.customCronFile, JSON.stringify(data, null, ' '), async () => {
        resolve(data);
      });
    });
  }

  async initCron() {
    const customCronFile = this.customCronFile;
    if (!fs.existsSync(customCronFile)) {
      const ctx = this.ctx;
      const { data: list } = await ctx.service.scripts.list();
      if (!list || !list.length) return;
      const cronList = await ctx.service.scripts.readFile(path.join(this.app.config.scriptsDir, 'docker/crontab_list.sh'));
      if (!cronList || !cronList.length) return;
      const data = await this.createCronJson(list, cronList);
      await this.createSchedule(data);
    } else {
      const data = requireJSON(customCronFile);
      await this.createSchedule(data);
    }
  }

  // 创建cron.json文件
  createCronJson(list, cronList) {
    const cronJson = list.reduce((list, { filename, title, index }) => {
      const cron = cronList.find(line => line.includes(filename));
      if (cron && !cron.startsWith('#')) {
        list.push({
          index,
          title,
          filename,
          cron: cron.split(/\s/g).slice(0, 5).join(' '),
        });
      }
      return list;
    }, []);
    return this.saveFile(cronJson);
  }

  // 生成app/schedule脚本列表
  async createSchedule(data) {
    // const schedulePath = path.join(this.app.baseDir, 'app', 'schedule');
    // if (!fs.existsSync(schedulePath)) fs.mkdirSync(schedulePath);
    //     for (const { filename, cron } of data.slice(0, 1)) {
    //       if (!fs.existsSync(path.join(schedulePath, `auto_${filename}`)) || force) {
    //         fs.writeFile(
    //           path.join(schedulePath, `auto_${filename}`),
    //           `'use strict';

    // const path = require('path');
    // const { requireJSON } = require('../common/utils');

    // module.exports = app => {
    //   const customCronFile = path.join(app.baseDir, 'cron.json');
    //   const cronList = requireJSON(customCronFile);
    //   const { cron } = cronList.find(cronConfig => cronConfig.filename === '${filename}');

    //   return {
    //     schedule: {
    //       cron, // ${cron}
    //       type: 'worker',
    //       immediate: true,
    //     },
    //     async task(ctx) {
    //       console.log('开始执行${filename}');
    //       ctx.service.scripts.runScript('${filename}', true);
    //     },
    //   };
    // };
    // `,
    //           'utf8',
    //           () => {
    //             // console.log(`${filename}文件写入成功`);
    //           });
    //       }
    //     }
    const latestCron = this.app[CRON_INSTANCE];
    if (latestCron && latestCron.length) {
      for (const cron of latestCron) {
        cron.stop();
      }
      this.app[CRON_INSTANCE].length = 0;
    }
    const crons = [];
    for (const { filename, cron } of data.slice(1, 2)) {
      crons.push(new BaseCron(filename, cron, this.ctx));
    }
    this.app[CRON_INSTANCE] = crons;
  }

  /**
   * 获取文件
   */
  async file() {
    const data = requireJSON(this.customCronFile);
    return new Response(data);
  }

  /**
   * 保存文件
   * @param {object} data 数据
   */
  async save(data) {
    this.saveFile(data);
    this.createSchedule(data);
    return new Response(true);
  }
}

module.exports = CronService;
