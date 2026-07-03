import React, { useEffect, useRef, useState, type Key } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { OrderItem } from '@/types/orderManage/orderList';
import { orderListApi } from '@/api/orderManage';
import { message, Form, Input, Select, Table, Space, Button, Tag } from 'antd';
import CreateOrderList from './components/CreateOrderList';
import type { IModalRef } from '@/types/modal';

const OrderList = () => {
  const [form] = Form.useForm();
  const [orderListData, setOrderListData] = useState<OrderItem[]>([]);
  const orderModalRef = useRef<IModalRef<OrderItem>>(null);

  //=======================================获取数据====================================
  const fetchOrderListData = async () => {
    try {
      const res = await orderListApi.getOrderList();
      setOrderListData(res.data.list);
    } catch (err) {
      console.error('Fetch Order List Error:', err);
    }
  };

  useEffect(() => {
    fetchOrderListData();
  }, []);

  //=====================================表头数据=========================================
  const columns: ColumnsType<OrderItem> = [
    {
      title: '订单编号',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
    },
    {
      title: '下单地址',
      dataIndex: 'startAddress',
      key: 'startAddress',
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '订单价格',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: orderAmount => `￥${orderAmount}`,
    },
    {
      title: '订单状态',
      dataIndex: 'state',
      key: 'state',
      render: state => {
        const stateMap: Record<number, string> = {
          1: '进行中',
          2: '已完成',
          3: '超时',
          4: '取消',
        };

        return <Tag>{stateMap[state]}</Tag>;
      },
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '司机名称',
      dataIndex: 'driverName',
      key: 'driverName',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleDetail(record)}>
            详情
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  //=============================================操作函数=============================================

  //搜索函数
  const searchOrderListData = () => {};

  //重置函数
  const handleReset = () => {};

  //新增数据
  const handleCreate = () => {
    orderModalRef.current?.open('create');
  };

  const handleDetail = (record: OrderItem) => {
    console.log('详情', record);
  };

  const handleDelete = (record: OrderItem) => {
    console.log('删除', record);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="search-form">
        <Form layout="inline" form={form} initialValues={{ state: 1 }}>
          <Form.Item label="订单ID" name="orderId">
            <Input type="text" placeholder="请输入订单ID" />
          </Form.Item>

          <Form.Item label="用户名称" name="userName">
            <Input type="text" placeholder="请输入用户名称" />
          </Form.Item>

          <Form.Item label="订单状态" name="state" style={{ width: 200 }}>
            <Select
              options={[
                { label: '进行中', value: 1 },
                { label: '已完成', value: 2 },
                { label: '超时', value: 3 },
                { label: '取消', value: 4 },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Space size={10}>
              <Button type="primary" onClick={searchOrderListData}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="base-table">
        <div className="header-wrapper">
          <div className="title text-lg font-medium">订单列表</div>
          <div className="action flex items-center gap-3">
            <Button type="primary" onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={orderListData}
          pagination={{
            pageSize: 10,
          }}
        />
      </div>
      <CreateOrderList ref={orderModalRef} update={fetchOrderListData} />
    </div>
  );
};

export default OrderList;
