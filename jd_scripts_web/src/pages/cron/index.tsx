import React, { useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

import request from '@/request'
import { useDidMount } from '@/hooks'

export default function Cron () {
    const [data, setData] = useState('');
    useDidMount(async () => {
        const { data } = await request.get('/cron/file');
        setData(data)
    })

    if(!data) return null;

    return <JSONInput
    placeholder={data}
    theme="dark_vscode_tribute"
    locale={locale}
    width='100%'
    height={`${document.documentElement.clientHeight - 48}px`}
/>
}