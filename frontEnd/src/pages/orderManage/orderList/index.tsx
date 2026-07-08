import { useEffect, useRef, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { OrderItem } from '@/types/orderManage/orderList';
import { orderListApi } from '@/api/orderManage';
import {
  message,
  Form,
  Input,
  Select,
  Table,
  Space,
  Button,
  Tag,
  Modal,
  theme,
} from 'antd';
import CreateOrderList from './components/CreateOrderList';
import type { IModalRef } from '@/types/modal';
import OrderDetail from './components/OrderDetails';
import OrderMarkerModal, {
  type OrderMarkerModalRef,
} from './components/OrderMarkerModal';
import OrderRouteModal, {
  type OrderRouteModalRef,
} from './components/OrderRouteModal';
import { formatDate, formatMobile, formatMoney } from '@/utils/format';

const OrderList = () => {
  const [form] = Form.useForm();
  const [orderListData, setOrderListData] = useState<OrderItem[]>([]);
  const orderModalRef = useRef<IModalRef<OrderItem>>(null);
  const detailRef = useRef<{ open: (orderId: string) => void }>(null);
  const markerModalRef = useRef<OrderMarkerModalRef>(null);
  const routeModalRef = useRef<OrderRouteModalRef>(null);
  const { token } = theme.useToken();

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
      dataIndex: 'orderId',
      key: 'orderId',
      align: 'center',
      render: (_, record) => record.orderId || record._id,
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
    },
    {
      title: '下单地址',
      dataIndex: 'startAddress',
      key: 'startAddress',
      align: 'center',
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      render: createTime => formatDate(createTime),
    },
    {
      title: '订单价格',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      align: 'center',
      render: orderAmount => formatMoney(orderAmount),
    },
    {
      title: '订单状态',
      dataIndex: 'state',
      key: 'state',
      align: 'center',
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
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
      render: mobile => formatMobile(mobile),
    },
    {
      title: '司机名称',
      dataIndex: 'driverName',
      key: 'driverName',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            style={{ marginRight: 3, color: token.colorText }}
            type="link"
            onClick={() => handleDetail(record.orderId)}
          >
            详情
          </Button>
          <Button
            style={{ marginRight: 3, color: token.colorText }}
            type="link"
            onClick={() => handleMarker(record)}
          >
            打点
          </Button>

          <Button
            style={{ marginRight: 3, color: token.colorText }}
            type="link"
            onClick={() => handleRoute(record)}
          >
            轨迹
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
  const searchOrderListData = async () => {
    try {
      const values = form.getFieldsValue();
      if (!values) return;
      const params = {
        ...values,
        orderId: values.orderId?.trim(),
        userName: values.userName?.trim(),
      };

      const res = await orderListApi.searchOrder(params);
      setOrderListData(res.data.list);
    } catch (err) {
      console.error('搜索订单列表失败:', err);
    }
  };

  //重置函数
  const handleReset = async () => {
    form.resetFields();
    await fetchOrderListData();
  };

  //新增数据
  const handleCreate = () => {
    orderModalRef.current?.open('create');
  };

  //导出数据
  const handleExport = async () => {
    try {
      const blob = await orderListApi.exportOrder();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `订单列表_${formatDate(Date.now()).replace(/[: ]/g, '-')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success('导出成功');
    } catch (err) {
      console.error('导出订单列表失败:', err);
      message.error('导出失败');
    }
  };

  //详情数据
  const handleDetail = (orderId: string) => {
    detailRef.current?.open(orderId);
  };

  //打点
  const handleMarker = (record: OrderItem) => {
    markerModalRef.current?.open(record);
  };

  //轨迹
  const handleRoute = (record: OrderItem) => {
    routeModalRef.current?.open(record);
  };

  //删除功能
  const handleDelete = (record: OrderItem) => {
    Modal.confirm({
      title: '确认',
      content: `确认要删除订单编号为：${record.orderId} 吗？`,
      cancelText: '取消',
      onOk: async () => {
        const res = await orderListApi.deleteOrderList(record._id);
        if (res.code === 200) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }

        fetchOrderListData();
      },
    });
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
          <div className="action flex items-center">
            <Button type="primary" onClick={handleCreate}>
              新增
            </Button>
            <Button onClick={handleExport}>导出</Button>
          </div>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={orderListData}
          pagination={{
            pageSize: 10,
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
      <CreateOrderList ref={orderModalRef} update={fetchOrderListData} />
      <OrderDetail mRef={detailRef} />
      <OrderMarkerModal ref={markerModalRef} update={fetchOrderListData} />
      <OrderRouteModal ref={routeModalRef} />
    </div>
  );
};

export default OrderList;
