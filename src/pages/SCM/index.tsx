import { useRef, useEffect, useState } from 'react';
import { getList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from "ahooks"
import { Button } from 'antd';

const Index = () => {
  const [dataList, setDataList] = useState([])
  const actionRef = useRef<ActionType>();

  const { error, loading } = useRequest(getList, {
    defaultParams: {
      page: 1,
      limit: 10
    },
    onSuccess: (result, params) => {
      setDataList(result.content.supplierDetailList)
      console.log(result, params, "obj")
    },
  });

  useEffect(() => {

  }, [])

  const valueEnum = {
    all: { text: '全部', status: 'Default' },
    running: { text: '运行中', status: 'Processing' },
    online: { text: '已上线', status: 'Success' },
    error: { text: '异常', status: 'Error' },
  };
  const columns: ProColumns[] = [
    {
      title: '供应商名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      valueType: 'select',
      dataIndex: 'status',
      // initialValue: ['all'],
      width: 100,
      valueEnum,
    },
    {
      title: '主营类目',
      dataIndex: 'classifyNames',
    },
    {
      title: '入驻时间',
      dataIndex: 'settleTime',
      valueType: 'dateTime',
    },
  ];

  const handleGet = async () => { };

  const handleClick = () => {
    console.log(actionRef.current);
    actionRef.current?.reload();
  };
  return (
    <ProTable
      columns={columns}
      options={false}
      actionRef={actionRef}
      rowKey="id"
      dataSource={dataList}
      // request={async (params = {}, sort) => {
      //   const { current, pageSize, ...other } = params;
      //   const msg = await getList({
      //     page: current,
      //     limit: pageSize,
      //     ...other
      //   });
      //   return {
      //     data: msg.content.supplierDetailList,
      //     success: msg.success,
      //     total: msg.content.total,
      //   };
      // }}
      loading={loading}
      revalidateOnFocus={false}
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
      }}
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleGet}>
          新建
        </Button>,
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleClick}>
          刷新
        </Button>,
      ]}
    />
  );
};

export default Index;
