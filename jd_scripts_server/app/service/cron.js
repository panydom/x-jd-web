'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const Response = require('../common/Response.js');

class CronService extends Service {
  get customCronFile() {
    return path.join(this.app.baseDir, 'cron.json');
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
      const data = require(customCronFile);
      await this.createSchedule(data);
      // 删除缓存
      delete require.cache[require.resolve(customCronFile)];

    }
  }

  // 创建cron.json文件
  createCronJson(list, cronList) {
    return new Promise(resolve => {
      const cronJson = list.reduce((list, { filename, title, index  }) => {
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
      fs.writeFile(this.customCronFile, JSON.stringify(cronJson, null, ' '), async () => {
        resolve(cronJson);
      });
    });
  }

  // 生成app/schedule脚本列表
  async createSchedule(data) {
    const schedulePath = path.join(this.app.baseDir, 'app', 'schedule');
    if(!fs.existsSync(schedulePath)) fs.mkdirSync(schedulePath);
    for (const { filename, cron } of data.slice(0, 1)) {
      if (!fs.existsSync(path.join(schedulePath, `auto_${filename}`))) {
        console.log('create', filename)
        fs.writeFile(
          path.join(schedulePath, `auto_${filename}`),
          `'use strict';

const path = require('path');

module.exports = app => {
  const customCronFile = path.join(app.baseDir, 'cron.json');
  const cronList = require(customCronFile);
  const { cron } = cronList.find(cronConfig => cronConfig.filename === '${filename}');
  delete require.cache[require.resolve(customCronFile)];

  return {
    schedule: {
      cron: cron, // ${cron}
      type: 'worker',
      immediate: true,
    },
    async task(ctx) {
      console.log('开始执行${filename}');
      ctx.service.scripts.runScript('${filename}', true);
    },
  };
};
`,
          'utf8',
          () => {
            // console.log(`${filename}文件写入成功`);
          });
      }
    }
  }

  async file() {
    const data = require(this.customCronFile);
    delete require.cache[require.resolve(this.customCronFile)];
    return new Response(data);
  }
}

module.exports = CronService;
