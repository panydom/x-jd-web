import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout:{
    title: "jd_scripts_web",
    logo: '/logo.svg',
    siderWidth: 200,
  },
  routes: [
    { path: '/', component: '@/pages/index', redirect: '/scripts' },
    {
      path: '/scripts',
      name: '脚本管理',
      component: '@/pages/scripts'
    },
    {
      path: '/user',
      name: '用户管理',
      component: '@/pages/user'
    },
    {
      path: '/env',
      name: '环境变量',
      component: '@/pages/env'
    },
    {
      path: '/cron',
      name: '定时任务',
      component: '@/pages/cron'
    },
  ],
  fastRefresh: {},
  favicon: '/logo.svg',
  proxy:{
    '/dev':{
      target: "http://127.0.0.1:7001",
      changeOrigin: true,
      pathRewrite: { '^/dev' : '' },
    }
  },
  antd: {
    dark: true,
    compact: true,
  },
});
