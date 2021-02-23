'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/list', controller.scripts.list);

  // 获取环境变量文件内容
  router.get('/api/getEnvFile', controller.scripts.getEnvFile);
  // 获取任务列表
  router.get('/api/task', controller.scripts.task);
  // 执行任务
  router.get('/api/runScript', controller.scripts.runScript);

  // 获取用户列表
  router.get('/api/users', controller.users.getUsers);
  // 添加Cookie
  router.get('/api/addCookie', controller.users.addCookie);

  // 获取登陆二维码
  router.get('/api/showQrCode', controller.users.getQrCode);
  // 取消获取二维码
  router.get('/api/cancelQrCode', controller.users.cancelQrCode);
};
