import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import type { IModalProp, IAction } from '@/types/modal';
import type { UserItem, UserFormData } from '@/types/systemManage/user';
import { request } from '@/utils/request';

const UserModel = forwardRef<
  { open: (type: IAction, data?: UserItem) => void },
  IModalProp
>(({ update }, ref) => {
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<IAction>('create');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<UserFormData>;
  const [initialData, setInitialData] = useState<UserItem | undefined>();

  //暴露open方法给父组件调用
  useImperativeHandle(ref, () => ({
    open: (type: IAction, data?: UserItem) => {
      setAction(type);
      setInitialData(data);
      setVisible(true);

      //编辑时回填表单
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    },
  }));
  // 关闭弹窗
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };
});
