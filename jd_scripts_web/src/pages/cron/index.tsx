import React, { useState, useCallback,useMemo } from 'react';
import { Tabs, Row, Col, Input } from 'antd';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

import request from '@/request'
import { useDidMount } from '@/hooks'

const { TabPane } = Tabs;

export default function Cron () {
    const [data, setData] = useState([] as any[]);
    useDidMount(async () => {
        const { data } = await request.get('/cron/file');
        setData(data)
    })

    const req = useCallback(async (json) => {
        const { data } = await request.post('/cron/file', {
            data: json
        });
        return data;
    }, []);

    const onChange = useCallback(async ({ error, jsObject }) => {
        if(!error) {    
            const success = await req(jsObject);
            if(success) {
                setData([...jsObject])
            }
        }
    }, []);

    const onInput = useCallback(async (e, index) => {
        const value = e.target.value;
        // @ts-ignore
        data[index].cron = value;
        setData([...data])
        await req(data);
    }, [data]);

    if(!data) return null;
    return (
        <Tabs tabPosition='left'>
            <TabPane tab="表单模式" key="1">
                <div style={{ width: '100%', height: `${document.documentElement.clientHeight - 48}px`, overflow: 'auto', paddingRight: 12 }}>
                    <Row gutter={16}>
                        {
                            data.map(({ title, cron }:{ cron: string; title: string}, index) => {
                                return (
                                    <Col lg={6} xl={4}   style={{ marginTop: 12 }}>
                                        <p>{title}</p>
                                        <Input value={cron} onChange={(e) => onInput(e, index)} />
                                    </Col>
                                )
                            })   
                        }
                    </Row>
                </div>
            </TabPane>
            <TabPane tab="编辑模式" key="2">
                <JSONInput
                    placeholder={data}
                    theme="dark_vscode_tribute"
                    locale={locale}
                    width='100%'
                    height={`${document.documentElement.clientHeight - 48}px`}
                    onChange={onChange}
                />
            </TabPane>
        </Tabs>
    )
}