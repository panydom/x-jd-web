import  React,{ useCallback, useState, useMemo } from 'react';
import { DeleteFilled } from '@ant-design/icons';
import request from '@/request';
import Layout from '@/layouts';
import { useDidMount } from '@/hooks';
import { Link } from '@/components';
import { Button, Modal, Table, Input, message, Alert, Tooltip } from 'antd'
import QRCode from 'qrcode.react';
import styles from './index.less'


export default function User(){
  const [users, setUsers] = useState([]);
  const [data, setData] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  // const [cookie, setCookie] = useState('pt_key=AAJgMyZ5ADDHo4PfBu9A_osAsrUPvtn5626C_-4YNdZuP01b8YxyJyPFd18Vquq0JWMTkJi3wZs;pt_pin=15108447254_p;');
  const [cookie, setCookie] = useState('');
  const [addVisible, setAddVisible] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const url = useMemo(() => data? ((data.match(/https:\/\/plogin[^\n]*/) || [])[0]):'', [data]);

  //获取用户列表
  const getUserList = useCallback(async () => {
    try{
      setListLoading(true);
      const {data} = await request.get('/users')
      setUsers(data);
    }finally{
      setListLoading(false);
    }

  }, []);

  useDidMount(()=>{
    getUserList()
  })

  // 扫码获取Cookie
  const getCookie = useCallback(async () => {
    try{
      setLoading(true)
      const { data:str } = await request.get('/showQrCode');
      setData(str)
      setVisible(true)
    }
    finally{
      setLoading(false)
    }
  }, []);

  // 取消扫码
  const cancelGetQrCode = useCallback(async () => {
    setClosing(true);
    const { data } = await request.get('/cancelQrCode')
    if(data){
      setVisible(false)
    }
    setClosing(false)
  }, []);

  // 已扫码
  const scaned = useCallback(async () => {
    cancelGetQrCode();
    getUserList();
  }, []);

  const addCookie = useCallback(() => {
    setAddVisible(true);
  }, []);

  // 输入Cookie
  const onCookie = useCallback((e) => {
    setCookie(e.target.value)
  }, []);

  // 提交Cookie
  const onAddCookie = useCallback(async () => {
    if(!/(pt_key=(.*?);pt_pin=(.*?);)+/.test(cookie)){
      message.error("Cookie格式不正确")
      return;
    }
    try{
      setAddLoading(true);
      await request.get('/addCookie', {
        params:{
          cookie
        }
      })
      setAddVisible(false);
      getUserList();
    }
    finally{
      setAddLoading(false);
    }
  }, [cookie]);

  // 删除用户
  const deleteUser = useCallback(async (userName: string) => {
    try{
      await request.delete('/user', {
        params:{
          userName
        }
      })
      getUserList()
      message.success("删除成功");
    }
    catch(e){
      message.error("操作失败")
    }
    
  }, []);

  const renderButton = useCallback((text: string, record) => {
    const { userName } = record;
    return (
      <>
      <Tooltip title="删除">
        <DeleteFilled className={styles.icon} onClick={()=> deleteUser(userName)} />
      </Tooltip>
      </>
    )
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: "用户名",
        dataIndex: 'userName',
      },
      {
        title: "pt_key",
        dataIndex: 'pt_key',
      },
      {
        title: "pt_pin",
        dataIndex: 'pt_pin',
      },
      {
        title: "操作",
        dataIndex: 'op',
        render: renderButton,
      }
    ]
  }, [renderButton])
  return (
    <Layout>
      <div className={styles.head}>
        <Link value='https://gitee.com/lxk0301/jd_docker/blob/master/backUp/GetJdCookie.md' label='浏览器获取京东cookie教程' target='_blank'></Link>
        <Link value='https://gitee.com/lxk0301/jd_docker/blob/master/backUp/GetJdCookie2.md' label='插件获取京东cookie教程' target="_blank"></Link>
        <Button type="primary" onClick={getUserList}>刷新</Button>
        <Button type="primary" onClick={getCookie} loading={loading} style={{ marginLeft: 8 }}>扫码获取Cookie</Button>
        <Button type="primary" onClick={addCookie} style={{ marginLeft: 8 }}>手动添加Cookie</Button>
      </div>
      <Table columns={columns} dataSource={users} rowKey='userName' bordered pagination={false} style={{ marginTop: 12 }} loading={listLoading} />
      <Modal
        title="扫描获取Cookie"
        visible={visible}
        onOk={scaned}
        onCancel={cancelGetQrCode}
        cancelButtonProps={{ loading: closing }}
        okText="我已登陆"
        cancelText="取消"
      >
        <div className={styles.qrcode}>
        <QRCode value={url} size={250} includeMargin style={{ margin: '0 auto' }}></QRCode>
        </div>
        <p style={{marginTop: 12}}>请打开 京东APP 扫码登录(二维码有效期为3分钟)</p>
        <p style={{marginTop: 12}}>注：如扫描不到，请使用工具(例如在线二维码工具：https://cli.im)手动生成如下url二维码</p>
        <p style={{marginTop: 12}}>{url}</p>
      </Modal>
      <Modal
          title="手动添加Cookie"
          visible={addVisible}
          onOk={onAddCookie}
          onCancel={() => setAddVisible(false)}
          okButtonProps={{ loading: addLoading }}
          okText="确认"
          cancelText="取消"
        >
          <Alert message={<>格式：`pt_key=XXX;pt_pin=XXX;`<br />多个cookie用`&`分割</>} type="info" showIcon />
          <Input.TextArea style={{width: '100%', marginTop: 12}} rows={5} value={cookie} onChange={onCookie} />
        </Modal>
    </Layout>
  )
}