import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Space, Table, message } from 'antd';
import type { DeptItem } from '@/types/systemManage/dept';
import type { TableProps } from 'antd';
import type { IModalRef } from '@/types/modal';
import { deptApi } from '@/api/systemManage';
import CreateDept from './CreateDept';

const DepList = () => {
  const [form] = Form.useForm();
  const [deptList, setDeptList] = useState<DeptItem[]>([]);
  const deptModalRef = useRef<IModalRef<DeptItem>>(null);

  //获取部门数据
  const fetchDeptData = async () => {
    try {
      const res = await deptApi.getDeptList(form.getFieldsValue());
      setDeptList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeptData();
  }, []);

  //===============================================表格列配置========================================
  const columns: TableProps<DeptItem>['columns'] = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '负责人',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: DeptItem) => (
        <Space size={30}>
          <a
            onClick={() => handleCreate()}
            style={{ marginRight: 12, color: '#000' }}
          >
            新增
          </a>

          <a
            onClick={() => handleEdit(record)}
            style={{ marginRight: 12, color: '#000' }}
          >
            编辑
          </a>

          <a
            onClick={() => handleDelete(record._id)}
            style={{ color: '#f5222d' }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  //===================================================操作按钮===================================================
  //编辑按钮
  const handleEdit = (record: DeptItem) => {
    deptModalRef.current?.open('edit', record);
  };

  //新增按钮
  const handleCreate = () => {
    deptModalRef.current?.open('create');
  };

  // 删除按钮
  const handleDelete = (_id: string) => {
    Modal.confirm({
      title: '确认',
      content: '确认删除该菜单吗?',
      cancelText: '取消',
      onOk: async () => {
        const res = await deptApi.deleteDepList({ _id });
        message.success(res.message);
        fetchDeptData();
      },
    });
  };

  //重置按钮
  const handleReset = () => {
    form.resetFields();
    fetchDeptData();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="search-form">
        <Form layout="inline" form={form} initialValues={{ menuState: 1 }}>
          <Form.Item label="部门名称" name="deptName">
            <Input type="text" placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item>
            <Space size={10}>
              <Button type="primary" onClick={fetchDeptData}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="base-table">
        <div className="header-wrapper">
          <div className="title text-lg font-medium">菜单列表</div>
          <div className="action flex items-center gap-3">
            <Button type="primary" onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table<DeptItem>
          bordered
          rowKey="_id"
          columns={columns}
          dataSource={deptList}
        />
      </div>
      <CreateDept ref={deptModalRef} update={fetchDeptData} deptList={deptList} />
    </div>
  );
};

export default DepList;
