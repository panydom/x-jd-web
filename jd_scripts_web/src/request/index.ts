import request, { extend } from 'umi-request';
import { message } from 'antd';
const devPrefix = '/dev'

const instance = extend({
  prefix: `${devPrefix}/api`,
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