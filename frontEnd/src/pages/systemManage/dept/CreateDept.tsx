import React from 'react';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { Form, Input, message, Modal, Select, TreeSelect } from 'antd';
import type { IModalProp, IAction, IModalRef } from '@/types/modal';
import { deptApi, userApi } from '@/api';
import type { DeptItem } from '@/types/systemManage/dept';
import type { UserItem } from '@/types/systemManage/user';

const CreateDept = forwardRef<IModalRef<DeptItem>, IModalProp>((props, ref) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<IAction>('create');
  const [deptList, setDeptList] = useState<DeptItem[]>([]);
  const [userList, setUserList] = useState<UserItem[]>([]);

  //获取部门数据
  const fetchDeptData = async () => {
    try {
      const res = await deptApi.getDeptList();
      setDeptList(res.data);
    } catch (err) {
      console.error('Fetch Dept List Error:', err);
    }
  };

  //获取用户数据
  const fetchUserData = async () => {
    try {
      const res = await userApi.getUserInfo();
      setUserList(res.data.list);
    } catch (err) {
      console.error('Fetch User List Error:', err);
    }
  };

  useEffect(() => {
    fetchDeptData();
    fetchUserData();
  }, []);

  //打开弹窗的方法
  // type：表示当前操作类型，比如 create / edit / delete
  const open = useCallback(
    (type: IAction, data?: DeptItem) => {
      setVisible(true);
      setAction(type);
      if (type == 'edit' && data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    },
    [form]
  );

  useImperativeHandle(ref, () => {
    return {
      open,
    };
  });

  //================================================操作函数=============================================
  //菜单提交
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      if (action === 'create') {
        const res = await deptApi.createDeptList(form.getFieldsValue());
        message.success(res.message);
      } else {
        const res = await deptApi.editDepList(form.getFieldsValue());
        message.success(res.message);
      }
    }
  };

  //取消弹窗
  const handleCancle = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title={action === 'create' ? '创建菜单' : '编辑菜单'}
      open={visible}
      width={800}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancle}
    >
      <Form form={form} labelAlign="right" labelCol={{ span: 4 }}>
        <Form.Item hidden name="_id">
          <Input />
        </Form.Item>

        <Form.Item label="上级部门" name="parentId">
          <TreeSelect
            placeholder="请选择上级部门"
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={deptList}
          />
        </Form.Item>

        <Form.Item
          label="部门名称"
          name="deptName"
          rules={[{ required: true, message: '请输入部门名称' }]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>

        <Form.Item
          label="负责人"
          name="userName"
          rules={[{ required: true, message: '请选择负责人' }]}
        >
          <Select
            options={userList.map(item => ({
              label: item.userName,
              value: item.userName,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateDept;
