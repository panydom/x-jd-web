'use strict';

const parser = require('cron-parser');

class BaseCron {
  constructor(filename, cron, ctx) {
    this.filename = filename;
    this.update(cron);
    this.ctx = ctx;
    this.timer = null;
    this.start();
  }
  start() {
    const nextTick = this.getNextTick();
    if (nextTick) {
      this.timer = setTimeout(() => this.task(), nextTick);
    }
    return this;
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  update(cron) {
    if (cron !== this.cron) {
      this.cron = cron;
      this.instance = parser.parseExpression(cron);
    }
  }

  // 获取从现在开始的延迟数
  getNextTick() {
    const now = Date.now();
    let nextTick = null;
    do {
      const next = this.instance.next();
      nextTick = next.getTime();
    } while (nextTick <= now);
    return nextTick - now;
  }

  async task(ctx) {
    console.log(`开始执行${this.filename}`);
    (ctx || this.ctx).service.scripts.runScript(this.filename, true);
    this.start();
  }
}

module.exports = BaseCron;
