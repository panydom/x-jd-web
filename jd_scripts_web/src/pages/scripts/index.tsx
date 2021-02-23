import React, { useState, useMemo, useCallback} from 'react';
import { Table } from 'antd';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import request from '@/request'
import Layout from '@/layouts'
import { useDidMount } from '@/hooks';
import { Link } from '@/components';
import styles from './index.less';

export default function Scripts () {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取任务列表
  const [taskList, setTaskList] = useState([] as any[]);
  const getTaskList = useCallback(async () => {
   const { data } = await request.get('/task')
   setTaskList(data)
  }, []);

  // 运行脚本
  const runScript = useCallback(async (scriptName, run = true) => {
    const { data: task } = await request.get('/runScript', {
      params:{
        scriptName,
        run,
      }
    })
    setTaskList(task);
  }, []);

  const renderOp = useCallback((text, record, index) => {
    const { filename } = record;
    const running = taskList.includes(filename);
    return (
      <>
        {
          running ? (
            <PauseCircleFilled className={styles.icon} onClick={() => runScript(filename, false)} />
          ) :(
            <PlayCircleFilled className={styles.icon} onClick={() => runScript(filename)} />
          )
        }
      </>
    )
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
      <Table columns={columns} dataSource={data} rowKey='filename' bordered pagination={false} loading={loading} />
    </Layout>
  )
}