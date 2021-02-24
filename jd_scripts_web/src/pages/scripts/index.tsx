import React, { useState, useMemo, useCallback,useEffect, useRef } from 'react';
import { Table, Tooltip, message, Button } from 'antd';
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

  // 获取任务列表
  const [taskList, setTaskList] = useState([] as any[]);
  const timer = useRef<NodeJS.Timeout>();
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
        render: (text: string) => <Link value={text} label="查看脚本" />
      },
      {
        title: "活动地址",
        dataIndex: 'address',
        key: 'address',
        render: (text: string) => <Link value={text} label="活动地址" />
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
  return (
    <Layout>
      <p>当前有{taskList.length}个运行中的脚本（{taskList.map(t => <Button key={t} type="link">{t}</Button>)}）</p>
      <Table columns={columns} dataSource={data} rowKey='filename' bordered pagination={false} loading={loading} rowClassName={rowClassName} />
    </Layout>
  )
}