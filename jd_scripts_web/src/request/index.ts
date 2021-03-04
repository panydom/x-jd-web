import request, { extend } from 'umi-request';
import { message } from 'antd';
const devPrefix = 'production' === process.env.NODE_ENV ? `/${CONTEXT_PATH}` : '/dev'
const instance = extend({
  prefix: `${devPrefix}/api`,
  credentials: 'include',
})

instance.interceptors.request.use((url, config) => {
  const match = document.cookie.match(/csrfToken=(.*?)(;|$)/)
  if(match) {
    config.headers = config.headers || {};
    // @ts-ignore
    config.headers['x-csrf-token'] = match[1];
  }
  return {
    url,
    config,
  }
})

instance.interceptors.response.use(async (response, options) => {
  const res = await response.clone().json();
  if(res.errCode !== 0 ){
    message.error(res.errMsg);
    throw response
  }
  return response
})

export default instance