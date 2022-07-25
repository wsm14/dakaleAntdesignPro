import { getList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef } from 'react';

const index = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '供应商名称',
      dataIndex: 'name',
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

  const handleGet = async () => {};

  const handleClick = () => {
    console.log(actionRef.current);
    actionRef.current?.reload();
  };
  return (
    <ProTable
      columns={columns}
      options={false}
      actionRef={actionRef}
      search={
        {
          // optionRe nder: false,
          // collapsed: false,
        }
      }
      rowKey="id"
      request={async (params = {}, sort, filter) => {
        const { current, pageSize } = params;
        const msg = await getList({
          page: current,
          limit: pageSize,
        });
        return {
          data: msg.content.supplierDetailList,
          success: msg.success,
          total: msg.content.total,
        };
      }}
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
    ></ProTable>
  );
};

export default index;
