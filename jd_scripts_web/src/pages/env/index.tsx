import React, { useState } from 'react';
import { useDidMount } from '@/hooks';
import Layout from '@/layouts';
import request from '@/request';
import { Link } from '@/components';

export default function Env(){
  const [file, setFile] = useState('');
  useDidMount(async ()=>{
    // const {data} = await request.get('/getEnvFile')
    // setFile(data);
  })
  return (
    <Layout>
      <Link value="https://gitee.com/lxk0301/jd_docker/blob/master/githubAction.md" label="环境变量说明" target="_blank" />
      {/* <div dangerouslySetInnerHTML={{__html: file}}></div> */}
    </Layout>
  )
}