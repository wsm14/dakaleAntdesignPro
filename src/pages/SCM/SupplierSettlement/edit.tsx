import React, { useRef } from 'react'
import type { ProFormInstance } from '@ant-design/pro-components';
import {
    ProCard
} from '@ant-design/pro-components';
import { Button } from 'antd';
import Forms from './Forms'

const Edit = () => {
    const formRef = useRef<
        ProFormInstance<{
            name: string;
            company?: string;
            useMode?: string;
        }>
    >();
    return (
        <>
            <ProCard>
                <Forms formRef={formRef} />
                <Button onClick={() => {
                    formRef.current?.validateFieldsReturnFormatValue?.().then((values) => {
                        console.log('校验表单并返回格式化后的所有数据：', values);
                    });
                }}>点击啊</Button>
            </ProCard>
        </>
    )
}

export default Edit