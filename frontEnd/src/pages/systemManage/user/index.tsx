import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Table, Form, Input, Space, Select, Modal } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import userApi from '@/api/systemManage/user';
import type { UserItem, UserParams } from '@/types/systemManage/user';
import { useAntdTable } from 'ahooks';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

const columns: TableColumnsType<UserItem> = [
  {
    title: 'User ID',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: 'Username',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: 'User Email',
    dataIndex: 'userEmail',
    key: 'userEmail',
  },
  {
    title: 'User Role',
    dataIndex: 'role',
    key: 'role',
    render(role: number) {
      return {
        0: '超级管理员',
        1: '管理员',
        2: '体验管理员',
        3: '普通用户',
      }[role];
    },
  },
  {
    title: 'User Status',
    dataIndex: 'state',
    key: 'state',
    render(state: number) {
      return {
        0: '在职',
        1: '离职',
        2: '试用期',
      }[state];
    },
  },
  {
    title: 'Register Time',
    dataIndex: 'createAt',
    key: 'createAt',
  },
  {
    title: 'Operation',
    key: 'action',
    width: 180,
    render: (_, record) => (
      <Space size={30}>
        <a onClick={() => handleEdit(record)}>Edit</a>
        <a onClick={() => handleDelete(record)} style={{ color: '#f5222d' }}>
          Delete
        </a>
      </Space>
    ),
  },
];

//==========================================================操作接口===========================================================

//编辑功能
const handleEdit = (record: UserItem) => {};

//删除功能
const handleDelete = (record: UserItem) => {};

const UserList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState<UserItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  //获取表格数据
  const getTableData = (
    { current, pageSize }: { current: number; pageSize: number },
    formData: UserParams
  ) => {
    return userApi.getUserInfo().then(res => {
      const list = res.data.list;
      const filtered = list.filter((item: UserItem) => {
        const matchId = formData.userId
          ? item.userId.toString().includes(formData.userId.toString())
          : true;
        const matchName = formData.userName
          ? item.userName
              .toLowerCase()
              .includes(formData.userName.toLowerCase())
          : true;
        const matchState =
          formData.state !== undefined && formData.state !== null
            ? item.state === Number(formData.state)
            : true;
        return matchId && matchName && matchState;
      });

      return {
        total: filtered.length,
        list: filtered.slice((current - 1) * pageSize, current * pageSize),
      };
    });
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 10,
  });

  const handleSearch = () => {
    search.submit();
  };

  const handleReset = () => {
    form.resetFields(); // 重置表单字段
    search.reset(); // 重置表格分页到第一页
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const rowSelection: TableRowSelection<UserItem> = {};
  return (
    <div className="flex flex-col gap-5">
      <div className="search-form">
        <Form form={form} layout="inline">
          <Form.Item name="userId" label="用户ID">
            <Input placeholder="请输入用户ID" />
          </Form.Item>
          <Form.Item name="userName" label="用户名称">
            <Input placeholder="请输入用户名称" />
          </Form.Item>
          <Form.Item name="state" label="状态">
            <Select
              style={{ width: 120 }}
              placeholder="所有"
              allowClear
              options={[
                { value: 0, label: '在职' },
                { value: 1, label: '离职' },
                { value: 2, label: '试用期' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
              <Button type="default" onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="base-table">
        <div className="header-wrapper">
          <div className="title text-lg font-medium">用户列表</div>
          <div className="action flex items-center gap-3">
            <Button type="primary" onClick={showModal}>
              新增
            </Button>
            <Button type="primary" danger>
              批量删除
            </Button>
          </div>
        </div>

        <Table
          rowKey="_id"
          rowSelection={rowSelection}
          columns={columns}
          {...tableProps}
          bordered
        />
      </div>

      <div>
        <Modal
          title="Basic Modal"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    </div>
  );
};

export default UserList;
