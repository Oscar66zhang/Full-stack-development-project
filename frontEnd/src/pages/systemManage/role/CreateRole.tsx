import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Form, Input, message, Modal } from 'antd';
import type { IModalProp, IAction, IModalRef } from '@/types/modal';
import type {
  CreateParams,
  EditParams,
  RoleItem,
} from '@/types/systemManage/roles';
import { rolesApi } from '@/api/index';

const CreateRole = forwardRef<IModalRef<RoleItem>, IModalProp>((props, ref) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<IAction>('create');

  // 打开弹窗的方法
  // type：表示当前操作类型，比如 create / edit / delete
  // data：编辑时传入的当前行数据
  const open = useCallback(
    (type: IAction, data?: RoleItem) => {
      setVisible(true);
      setAction(type);

      if (type === 'edit' && data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    },
    [form]
  );

  // 暴露子组件内部方法给父组件使用
  // 父组件可以通过 ref.current.open(...) 调用这里的 open 方法
  useImperativeHandle(ref, () => ({
    open,
  }));

  //========================================操作按钮========================================
  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (action === 'create') {
      const res = await rolesApi.createRole(values as CreateParams);
      message.success(res.message);
    } else {
      const res = await rolesApi.editRole(values as EditParams);
      message.success(res.message);
    }
    setVisible(false);
    form.resetFields();
    props.update();
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title={action === 'create' ? '创建角色' : '编辑角色'}
      open={visible}
      onOk={handleSubmit}
      okText="确定"
      cancelText="取消"
      onCancel={handleCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign="right">
        <Form.Item name="_id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="角色名称"
          name="roleName"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={4} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateRole;
