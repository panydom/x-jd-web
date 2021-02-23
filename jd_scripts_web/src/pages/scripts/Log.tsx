import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FileTextFilled } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import request from '@/request'

export interface LogProps{
  className?: string;
  id: string;
  running: boolean;
}

export default function Log(props: LogProps) {
  const { id, running } = props;
  const [visible, setVisible] = useState(false);
  const [log, setLog] = useState('');
  const timer = useRef<NodeJS.Timeout>();
  const lastVisible = useRef(false);
  const lastRunning = useRef(false);
  const getLog = useCallback(async () => {
    const {data} = await request.get('/getLog', {
      params:{
        id,
      }
    });

    setLog(data)
  }, [id]);

  // 轮训查日志
  const loopLog = useCallback(async () => {
    timer.current = setTimeout(()=>{
      getLog();
      loopLog()
    }, 2000);
  }, []);
  // 结束轮训
  const cancelLoop = useCallback(() => {
    if(timer.current){
      // 取消的时候最后拉一次
      getLog();
      clearTimeout(timer.current);
      timer.current = null as unknown as NodeJS.Timeout;
    }
  }, []);
  
  useEffect(() => {
    if(visible){
      if(running) {
        loopLog();
      }
      else {
        if (!lastVisible.current) getLog();
        if (lastRunning.current) cancelLoop();
      }
    }else{
      cancelLoop();
    }
    return () => {
      lastRunning.current = running;
      lastVisible.current = visible;
    }
    
  }, [running, visible]);

  const onClose = useCallback(() => {
    setVisible(false)
  }, []);

  const showLog = useCallback(() => {
    setVisible(true);
  }, [getLog]);

  return (
    <>
      <Tooltip title="查看日志">
        <FileTextFilled className={props.className} onClick={showLog}/>
      </Tooltip>
      <Modal title={id} visible={visible} onOk={onClose} onCancel={onClose} okText="知道了" cancelText="关闭" width="80vw">
        <pre style={{height: '60vh'}}>{log}</pre>
      </Modal>
    </>
  )
}