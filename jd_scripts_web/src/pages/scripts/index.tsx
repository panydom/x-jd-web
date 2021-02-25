import React, { useState, useMemo, useCallback,useEffect, useRef } from 'react';
import { Table, Tooltip, message, Button, Modal, Spin } from 'antd';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import request from '@/request'
import Layout from '@/layouts'
import { useDidMount } from '@/hooks';
import { Link } from '@/components';
import styles from './index.less';
import Log from './Log';

export default function Scripts () {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [deleting, setDeleting] = useState(false);
  // 获取任务列表
  const [taskList, setTaskList] = useState([] as any[]);
  const timer = useRef<NodeJS.Timeout>();
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  const title = useRef()
  const [contentLoading, setContentLoading] = useState(false);

  const getTaskList = useCallback(async () => {
   const { data } = await request.get('/task')
   setTaskList(data)
  }, []);

  // 轮训查任务列表
  const lookTask = useCallback(() => {
    timer.current = setTimeout(() => {
      getTaskList();
      lookTask()
    }, 2000);
  }, []);

  // 任务执行，开启定时器
  useEffect(() => {
    // 有任务
    if(taskList.length && !timer.current) {
      lookTask();
    }else if (!taskList.length && timer.current) {
      clearTimeout(timer.current);
      timer.current = null as unknown as NodeJS.Timeout;
    }
  }, [taskList]);

  // 运行脚本
  const runScript = useCallback(async (scriptName, run = true) => {
    if(taskList.length >=5){
      message.warning("暂定最多同时运行5个脚本")
      return;
    }
    const { data: task } = await request.get('/runScript', {
      params:{
        scriptName,
        run,
      }
    })
    setTaskList(task);
  }, [taskList]);

  const renderOp = useCallback((text, record, index) => {
    const { filename } = record;
    const running = taskList.includes(filename);
    return (
      <>
        {
          running ? (
            <Tooltip title='停止运行'>
              <PauseCircleFilled className={styles.icon} onClick={() => runScript(filename, false)} />
            </Tooltip>
          ) :(
            <Tooltip title='运行脚本'>
              <PlayCircleFilled className={styles.icon} onClick={() => runScript(filename)} />
            </Tooltip>
          )
        }
        <Log className={styles.icon} id={filename} running={running} />
      </>
    )
  }, [taskList, runScript]);

  const rowClassName = useCallback((record, index) => {
    const { filename } = record;
    const running = taskList.includes(filename);
    return running ? styles.running : ''
  }, [taskList]);

  // 查看文件内容
  const showContent = useCallback(async (filename) => {
    setVisible(true);
    setContentLoading(true);
    try{
      const { data } = await request.get(`/script/${filename}`);
      title.current = filename
      setContent(data);
    }finally{
      setContentLoading(false);
    }
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '脚本标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: "脚本名",
        dataIndex: 'filename',
        key: 'filename',
      },
      {
        title: "脚本地址",
        dataIndex: 'filepath',
        key: 'filepath',
        render: (text: string, record: any) => {
          return <Button type='link' onClick={() => showContent(record.filename)}>查看脚本</Button>
        }
      },
      {
        title: "活动地址",
        dataIndex: 'address',
        key: 'address',
        render: (text: string) => <Link value={text} label="活动地址" target="_blank" />
      },
      {
        title: "操作",
        dataIndex: 'op',
        key: 'op',
        render: renderOp
      }
    ]
  }, [renderOp]);
  useDidMount(async () => {
    try{
      const { data: list } = await request.get('/list')
      setData(list)
      getTaskList();
    }
    finally{
      setLoading(false)
    }
  });

  // const deleteLog = useCallback(async () => {
  //   setDeleting(true);
  //   try{
  //     await request.delete('/logs')
  //   }finally{
  //     setDeleting(false);
  //   }
  // }, []);
  return (
    <Layout>
      <div className={styles.header}>
        <p style={{ margin: 0 }}>当前有{taskList.length}个运行中的脚本（{taskList.map(t => <Button key={t} type="link">{t}</Button>)}）</p>
        {/* <Button danger type="primary" onClick={deleteLog} loading={deleting}>删除所有日志</Button> */}
      </div>
      <Table columns={columns} dataSource={data} rowKey='filename' bordered pagination={false} loading={loading} rowClassName={rowClassName} style={{ marginTop: 12 }} />
      <Modal
        title={`${title.current}文件内容`}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        okText="确认"
        cancelText="取消"
        width='80vw'
      >
        <Spin spinning={contentLoading} >
          <pre style={{width: '100%', height: '60vh'}}>{content}</pre>
        </Spin>
      </Modal>
    </Layout>
  )
}