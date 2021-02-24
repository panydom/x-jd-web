import React, { useState, useCallback } from 'react';
import { useDidMount } from '@/hooks';
import Layout from '@/layouts';
import request from '@/request';
import { Link } from '@/components';
import { Tabs, Select, Tooltip, Input, Row, Col } from 'antd';
import { QuestionCircleOutlined} from '@ant-design/icons';
import styles from './index.less';
const { TabPane } = Tabs;

interface DataItem {
  title:string;
  fields: FieldItem[];
}
interface FieldItem{
  title: string;
  summary: string; 
  id: string;
  value: any;
  suffix?: string;
  options?: any[];
  mode?: "multiple" | "tags";
}

const formItemStyle = {
  width: 300,
}

export default function Env(){
  const [data, setData] = useState([] as DataItem[]);
  useDidMount(async ()=>{
    const {data} = await request.get('/envFile')
    setData(data);
  })

  const postFile = useCallback(async (data) => {
    await request.post('/envFile', {
      data,
    })
  }, []);

  const onChange = useCallback((type, index, value) => {
    setData(([...originData]) => {
      originData[type].fields[index].value = value;
      postFile(originData)
      return originData;
    })
  }, [data]);

  const renderTab = useCallback((fields:FieldItem[], type: number ) => {
    return (
      <Row gutter={16}>
        {fields.map(({ title, summary, id, value, suffix, options, mode }, index) => {
          if(id === 'JD_COOKIE') return null;
          const isBoolean = typeof value === 'boolean'
          let content = null
          if(isBoolean){
            content = (
              <Select value={value.toString()} style={formItemStyle} onChange={(value) => onChange(type, index,value === 'true')}>
                <Select.Option value='true'>是</Select.Option>
                <Select.Option value='false'>否</Select.Option>
              </Select>
            )
          }
          else if (options ) {
            // 宠汪汪赛道
            content = (
              <Select value={[value]} style={formItemStyle} mode={mode} onChange={(value) => {
                let v = value;
                if(id === "MARKET_COIN_TO_BEANS"){ v = value.length ? value[value.length-1] : ""}
                onChange(type, index, v)
              }}>
                {
                  options.map(option => <Select.Option value={option} key={option}>{option}</Select.Option>)
                }
              </Select>
            )
          }
          else {
            content = (
              <Input value={value} style={formItemStyle} onChange={(e) => onChange(type, index,e.target.value)} addonAfter={suffix} />
            )
          }
          return (
            <Col xs={12} key={index}>
              <div className={styles.item}>
                <div className={styles.label}>
                  <span className={styles.title}>{title}</span>
                  {summary? <Tooltip title={summary}><QuestionCircleOutlined className={styles.summary} /></Tooltip> : null}
                  ：
                </div>
                
                {content}
              </div>
            </Col>
          )
        })}
      </Row>
    )
  }, [onChange]);
  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Link value="https://gitee.com/lxk0301/jd_docker/blob/master/githubAction.md" label="环境变量说明" target="_blank" />
      </div>
      {/* <div dangerouslySetInnerHTML={{__html: file}}></div> */}
      <Tabs>
        {
          data.map(({ title, fields }, type)=>{
            return (
              <TabPane tab={title} key={title}>
                {renderTab(fields, type)}
              </TabPane>
            )
          })
        }
      </Tabs>
    </Layout>
  )
}