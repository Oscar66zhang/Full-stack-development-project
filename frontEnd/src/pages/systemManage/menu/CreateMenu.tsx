import React from 'react';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import {
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  TreeSelect,
} from 'antd';
import type { IModalProp, IAction, IModalRef } from '@/types/modal';
import { menuApi } from '@/api';
import type { MenuItem } from '@/types/systemManage/menu';
import { InfoCircleOutlined } from '@ant-design/icons';

const CreateMenu = forwardRef<IModalRef<MenuItem>, IModalProp>((props, ref) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<IAction>('create');
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  //获取菜单数据
  const fetchMenuData = async () => {
    try {
      const res = await menuApi.getMenuList(form.getFieldsValue());
      setMenuList(res.data);
    } catch (error) {
      console.error('Failed to fetch menu data:', error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // 打开弹窗的方法
  // type：表示当前操作类型，比如 create / edit / delete
  const open = useCallback(
    (type: IAction, data?: MenuItem) => {
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

  useImperativeHandle(ref, () => {
    return {
      open,
    };
  });

  //========================================================操作函数========================================

  //菜单提交
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      if (action === 'create') {
        const res = await menuApi.createMenu(form.getFieldsValue());
        message.success(res.message);
      } else {
        const res = await menuApi.editMenu(form.getFieldsValue());
        message.success(res.message);
      }
    }
    handleCancel();
    //props.update() 的作用是：新增/编辑成功后，通知父组件刷新列表
    props.update();
  };

  //取消
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title={action === 'create' ? '创建菜单' : '编辑菜单'}
      open={visible}
      width={800}
      onOk={handleSubmit}
      okText="确定"
      cancelText="取消"
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelAlign="right"
        labelCol={{ span: 4 }}
        initialValues={{ menuType: 1, menuState: 1 }}
      >
        <Form.Item hidden name="_id">
          <Input />
        </Form.Item>

        <Form.Item label="上级菜单" name="parentId">
          <TreeSelect
            placeholder="请选择父级菜单"
            treeDefaultExpandAll
            allowClear
            fieldNames={{ label: 'menuName', value: '_id' }}
            treeData={menuList}
          />
        </Form.Item>

        <Form.Item label="菜单类型" name="menuType">
          <Radio.Group>
            <Radio value={1}>菜单</Radio>
            <Radio value={2}>按钮</Radio>
            <Radio value={3}>页面</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="菜单名称"
          name="menuName"
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder="请输入菜单名称" />
        </Form.Item>

        {/*noStyle shouldUpdat： 监听表单字段变化，然后根据表单值动态渲染某些内容 */}
        <Form.Item noStyle shouldUpdate>
          {() => {
            return form.getFieldValue('menuType') === 2 ? (
              <Form.Item label="权限标识" name="menuCode">
                <Input placeholder="请输入权限标识" />
              </Form.Item>
            ) : (
              <>
                <Form.Item label="菜单图标" name="icon">
                  <Input placeholder="请输入菜单图标" />
                </Form.Item>
                <Form.Item label="路由地址" name="path">
                  <Input placeholder="请输入路由地址" />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>

        <Form.Item label="组件名称" name="component">
          <Input placeholder="请输入组件名称" />
        </Form.Item>

        <Form.Item
          label="排序"
          name="orderBy"
          tooltip={{
            title: '排序值越大越靠后',
            icon: <InfoCircleOutlined rev={undefined} />,
          }}
        >
          <InputNumber placeholder="请输入排序值" />
        </Form.Item>

        <Form.Item label="菜单状态" name="menuState">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={2}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
export default CreateMenu;
