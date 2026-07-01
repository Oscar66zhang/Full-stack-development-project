import React, { useEffect, useRef } from 'react';
import { rolesApi } from '@/api/';
import {
  Button,
  Flex,
  Space,
  Table,
  Tag,
  Form,
  Input,
  Modal,
  message,
} from 'antd';
import type { TableColumnsType } from 'antd';
import type { RoleItem } from '@/types/systemManage/roles';
import CreateRole from './CreateRole';
import SetPermission from './SetPermission';
import type { IModalRef } from '@/types/modal';

const RoleList = () => {
  const [form] = Form.useForm();
  const [roleList, setRoleList] = React.useState<RoleItem[]>([]);
  const roleModalRef = useRef<IModalRef<RoleItem>>(null);
  const permissionRef = useRef<IModalRef<RoleItem>>(null);

  //获取角色列表
  const getroleList = async () => {
    const res = await rolesApi.getRoleList(form.getFieldsValue());
    setRoleList(res.data.list);
  };

  useEffect(() => {
    getroleList();
  }, []);
  //========================================表格列配置========================================
  const columns: TableColumnsType<RoleItem> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size={30}>
          <a onClick={() => handleEdit(record)} style={{ color: '#000' }}>
            编辑
          </a>
          <a
            onClick={() => handleSetPermission(record)}
            style={{ color: '#000' }}
          >
            设置权限
          </a>
          <a onClick={() => handleDelete(record)} style={{ color: '#f5222d' }}>
            删除
          </a>
        </Space>
      ),
    },
  ];

  //========================================操作按钮========================================
  //创建角色
  const handleCreate = () => {
    roleModalRef.current?.open('create');
  };

  //编辑角色
  const handleEdit = (record: RoleItem) => {
    roleModalRef.current?.open('edit', record);
  };

  //删除角色
  const handleDelete = (record: RoleItem) => {
    Modal.confirm({
      title: '删除角色',
      content: '确定要删除该角色吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await rolesApi.deleteRole({ _id: record._id });
        message.success(res.message || '删除成功');
        getroleList();
      },
    });
  };

  //设置权限
  const handleSetPermission = (record: RoleItem) => {
    permissionRef.current?.open('edit', record);
  };

  //重置表单
  const handleReset = async () => {
    form.resetFields();
    const res = await rolesApi.getRoleList();
    setRoleList(res.data.list);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="search-form">
        <Form layout="inline" form={form}>
          <Form.Item label="角色名称" name="roleName">
            <Input type="text" placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item>
            <Space size={10}>
              <Button type="primary" onClick={getroleList}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="base-table">
        <div className="header-wrapper">
          <div className="title text-lg font-medium">角色列表</div>
          <div className="action flex items-center gap-3">
            <Button type="primary" onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table<RoleItem>
          rowKey="_id"
          bordered
          columns={columns}
          dataSource={roleList}
        />
      </div>

      <CreateRole ref={roleModalRef} update={getroleList} />
      <SetPermission ref={permissionRef} update={getroleList} />
    </div>
  );
};

export default RoleList;
