'use strict';
const path = require('path');
const fs = require('fs');
const config = require('../../config/env');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/api/list', controller.scripts.list);
  // 查看脚本内容
  router.get('/api/script/:filename', controller.scripts.content);
  // 获取环境变量文件内容
  router.get('/api/envFile', controller.scripts.getEnvFile);
  router.post('/api/envFile', controller.scripts.postEnvFile);
  // 获取任务列表
  router.get('/api/task', controller.scripts.task);
  // 执行任务
  router.get('/api/runScript', controller.scripts.runScript);
  // 查看日志
  router.get('/api/getLog', controller.scripts.getLog);
  router.delete('/api/logs', controller.scripts.deleteLogs);

  // 更新脚本
  router.get('/api/update', controller.scripts.update);


  // 获取用户列表
  router.get('/api/users', controller.users.getUsers);
  // 删除用户
  router.delete('/api/user', controller.users.deleteUser);
  // 添加Cookie
  router.get('/api/addCookie', controller.users.addCookie);

  // 获取登陆二维码
  router.get('/api/showQrCode', controller.users.getQrCode);
  // 取消获取二维码
  router.get('/api/cancelQrCode', controller.users.cancelQrCode);

  // 定时任务
  router.get('/api/cron/file', controller.cron.file);
  router.post('/api/cron/file', controller.cron.saveFile);

  router.get('*', ctx => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(app.config.static.dir, config.PUBLIC_PATH, 'index.html'));
  });
};
