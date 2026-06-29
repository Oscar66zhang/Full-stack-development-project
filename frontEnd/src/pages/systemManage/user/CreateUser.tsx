import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import type { IModalProp, IAction } from '@/types/modal';
import { request } from '@/utils/request';
import type { UserItem, UserParams } from '@/types/systemManage/user';

const CreateUser = (props: IModalProp) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<IAction>('create');
  const [img, setImg] = useState('');
  const [initialData, setInitialData] = useState<UserItem | undefined>();
};
