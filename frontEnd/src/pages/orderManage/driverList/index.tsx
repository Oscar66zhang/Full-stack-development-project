import type { DriverItem } from '@/types/orderManage/driverList';
import type { ColumnsType } from 'antd/es/table';
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
import { useState, useRef, useEffect } from 'react';
import type { IModalRef } from '@/types/modal';
import CreateDriverList from './CreateDriverList';
import { driverListApi } from '@/api';
import { formatDate } from '@/utils/format';

const DriverList = () => {
  const [driverList, setDriverList] = useState<DriverItem[]>([]);
  const [form] = Form.useForm();
  const driverModalRef = useRef<IModalRef<DriverItem>>(null);
  const { token } = theme.useToken();

  //获取司机列表的数据
  const fetchDriverList = async () => {
    const res = await driverListApi.getDriverList();
    setDriverList(res.data.list);
  };

  useEffect(() => {
    fetchDriverList();
  }, []);

  // 司机状态类型
  type DriverStatus = 0 | 1 | 2 | 3 | 4;

  // 司机状态映射表
  const statusMap: Record<DriverStatus, { text: string; color: string }> = {
    0: { text: '待认证', color: 'orange' },
    1: { text: '正常', color: 'green' },
    2: { text: '暂时拉黑', color: 'red' },
    3: { text: '永久拉黑', color: 'red' },
    4: { text: '停止推送', color: 'purple' },
  };

  //==============================================表头数据展示======================================================
  const columns: ColumnsType<DriverItem> = [
    {
      title: '司机名称',
      dataIndex: 'driverName',
      key: 'driverName',
    },
    {
      title: '司机信息',
      key: 'driverInfo',
      render: (_, record) => (
        <div>
          <div>ID：{record.driverId}</div>
          <div>手机号：{record.driverPhone}</div>
          <div>城市：{record.cityName}</div>
          <Space size={4}>
            {record.grade && <Tag color="blue">会员</Tag>}
            <Tag>等级：{record.driverLevel}</Tag>
          </Space>
        </div>
      ),
    },
    {
      title: '司机状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      render: (status: DriverStatus) => {
        const item = statusMap[status];

        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: '车辆信息',
      key: 'vehicleInfo',
      render: (_, record) => (
        <div>
          <div>车牌号：{record.carNo}</div>
          <div>
            {record.vehicleBrand} / {record.vehicleName}
          </div>
        </div>
      ),
    },
    {
      title: '昨日在线时长',
      dataIndex: 'onlineTime',
      key: 'onlineTime',
      render: (value: number) => `${value} 小时`,
    },
    {
      title: '昨日司机流水',
      dataIndex: 'driverAmount',
      key: 'driverAmount',
      render: (value: number) => `￥${value.toFixed(2)}`,
    },
    {
      title: '司机评分',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: '行为分',
      dataIndex: 'driverScore',
      key: 'driverScore',
    },
    {
      title: '昨日推单数',
      dataIndex: 'pushOrderCount',
      key: 'pushOrderCount',
    },
    {
      title: '昨日完单数',
      dataIndex: 'orderCompleteCount',
      key: 'orderCompleteCount',
    },
    {
      title: '加入时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      render: createTime => formatDate(createTime),
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <Space size={3}>
            <Button
              style={{ color: token.colorText }}
              type="link"
              onClick={() => handleEditDriverList(record)}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              onClick={() => handleDeleteDriverList(record)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  //==============================================操作函数==================================================
  //创建司机列表
  const createDriverList = async () => {
    driverModalRef.current?.open('create');
  };

  //编辑司机列表
  const handleEditDriverList = async (record: DriverItem) => {
    driverModalRef.current?.open('edit', record);
  };

  //删除司机按钮
  const handleDeleteDriverList = async (record: DriverItem) => {
    Modal.confirm({
      title: '确认',
      content: `确认要删除${record.driverName}司机吗?`,
      cancelText: '取消',
      onOk: async () => {
        const res = await driverListApi.deleteDriverList(record.driverId);
        if (res.code === 200) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
        fetchDriverList();
      },
    });
  };

  //搜索司机列表
  const searchDriverList = async () => {
    try {
      const values = form.getFieldsValue();
      if (!values) return;
      const params = {
        driverName: values.driverName?.trim(),
        accountStatus: Number(values.accountStatus),
      };

      const res = await driverListApi.searchDriverList(params);
      setDriverList(res.data.list);
    } catch (err) {
      console.log('Fetch Search Result Failed:', err);
    }
  };

  //重置搜索功能
  const resetSearch = async () => {
    form.resetFields();
    fetchDriverList();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="search-form">
        <Form layout="inline" form={form} initialValues={{ accountStatus: 1 }}>
          <Form.Item label="司机名称" name="driverName">
            <Input type="text" placeholder="请输入司机名称" />
          </Form.Item>

          <Form.Item
            label="司机状态"
            name="accountStatus"
            style={{ width: 200 }}
          >
            <Select
              options={[
                { label: '待认证', value: 0 },
                { label: '正常', value: 1 },
                { label: '暂时拉黑', value: 2 },
                { label: '永久拉黑', value: 3 },
                { label: '停止推送', value: 4 },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Space size={10}>
              <Button type="primary" onClick={searchDriverList}>
                搜索
              </Button>
              <Button onClick={resetSearch}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="base-table">
        <div className="header-wrapper">
          <div className="title text-lg font-medium">司机列表</div>
          <div className="action flex items-center">
            <Button type="primary" onClick={createDriverList}>
              新增
            </Button>
          </div>
        </div>
        <Table<DriverItem>
          rowKey="driverId"
          columns={columns}
          dataSource={driverList}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: 1,
            pageSize: 10,
            total: driverList.length,
            showTotal: total => `共 ${total} 条`,
          }}
        />
      </div>
      <CreateDriverList ref={driverModalRef} update={fetchDriverList} />
    </div>
  );
};

export default DriverList;
