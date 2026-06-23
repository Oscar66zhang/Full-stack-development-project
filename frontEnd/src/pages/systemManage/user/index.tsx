import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Table, Form, Input, Space, Select, Modal } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import userApi from '@/api/systemManage/user';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  userId: string | number;
  username: string;
  userEmail: string;
  userRole: string;
  userStatus: string;
  registerTime: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'User ID',
    dataIndex: 'userId',
  },
  {
    title: 'Username',
    dataIndex: 'username',
  },
  {
    title: 'User Email',
    dataIndex: 'userEmail',
  },
  {
    title: 'User Role',
    dataIndex: 'userRole',
  },
  {
    title: 'User Status',
    dataIndex: 'userStatus',
  },
  {
    title: 'Register Time',
    dataIndex: 'registerTime',
  },
  {
    title: 'Operation',
    key: 'action',
    width: 180, // 固定宽度防止挤压
    render: (_, record) => (
      <>
        <a onClick={() => handleEdit(record)} style={{ marginRight: 12 }}>
          Edit
        </a>
        <a onClick={() => handleDelete(record)} style={{ color: '#f5222d' }}>
          Delete
        </a>
      </>
    ),
  },
];

//==========================================================操作接口===========================================================
//编辑功能
const handleEdit = (record: DataType) => {};

//删除功能
const handleDelete = (record: DataType) => {};

const dataSource: Array<DataType> = [];

const UserList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchUserData = async () => {
    const res = await userApi.getUserInfo();
    console.log('获取用户信息:', res);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableRowSelection<DataType> = {};
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <p>用户列表</p>
        <div className="flex items-center gap-3">
          <Button type="primary" onClick={showModal}>
            新增
          </Button>
          <Button type="primary" danger>
            批量删除
          </Button>
        </div>
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

      <div>
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    </div>
  );
};

export default UserList;
