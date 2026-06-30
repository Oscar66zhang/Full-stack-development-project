import {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useEffect,
} from 'react';
import { Modal, Form, Input, Select, message, TreeSelect, Upload } from 'antd';
import type { IModalProp, IAction, IModalRef } from '@/types/modal';
import type { UserItem } from '@/types/systemManage/user';
import type { DeptItem } from '@/types/systemManage/dept';
import type { RoleItem } from '@/types/systemManage/roles';
import { userApi, rolesApi, deptApi } from '@/api/index';
import type { GetProp, UploadProps, UploadFile } from 'antd';
import type { RcFile, UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CreateUser = forwardRef<IModalRef<UserItem>, IModalProp>((props, ref) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<IAction>('create');
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState('');
  const [deptList, setDeptList] = useState<DeptItem[]>([]);
  const [roleList, setRoleList] = useState<RoleItem[]>([]);

  //调用获取函数的api
  useEffect(() => {
    getRoleList();
    getDeptList();
  }, []);

  //获取角色列表信息
  const getRoleList = async () => {
    const res = await rolesApi.getRoleList();
    setRoleList(res.data.list);
  };

  //获取部门列表信息
  const getDeptList = async () => {
    const res = await deptApi.getDeptList();
    setDeptList(res.data);
  };

  // 使用 useCallback 缓存 open 方法，避免组件每次渲染都重新创建函数
  const open = useCallback(
    (type: IAction, data?: UserItem) => {
      setVisible(true);
      setAction(type);
      if (type === 'edit' && data) {
        // 将当前用户数据回填到表单中
        form.setFieldsValue(data);
        // 回显用户头像
        setImg(data.userImg);
      } else {
        // 如果是新增操作，清空表单，避免显示上一次编辑的数据
        form.resetFields();
        setImg('');
      }
    },
    // form 是依赖项，form 变化时重新生成 open 方法
    [form]
  );

  // 通过 useImperativeHandle 向父组件暴露方法
  // 父组件可以通过 ref.current?.open('create') 或 ref.current?.open('edit', record) 调用
  useImperativeHandle(ref, () => ({
    open,
  }));

  //============================================================新建操作============================================================
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const params = {
        ...form.getFieldsValue(),
        userImg: img,
      };
      if (action === 'create') {
        const res = await userApi.createUser(params);
        message.success(res.message);
      } else {
        const res = await userApi.editUser(params);
        message.success(res.message);
      }
      props.update();
      setVisible(false);
      form.resetFields();
      setImg('');
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  //================================================文件处理==========================================================
  //上传之前处理接口
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传png或jpeg格式的图片');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片不能超过5M');
    }
    return isJpgOrPng && isLt5M;
  };

  // 上传后，图片处理
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      const { code, data, message: msg } = info.file.response;
      if (code === 0) {
        setImg(data.file);
      } else {
        message.error(msg);
      }
    } else if (info.file.status === 'error') {
      message.error('服务器异常，请稍后再试');
    }
  };

  const customUpload: UploadProps['customRequest'] = options => {
    setLoading(true);
    const file = options.file as RcFile;
    const url = URL.createObjectURL(file);
    setTimeout(() => {
      setLoading(false);
      setImg(url);
      options.onSuccess?.({ code: 0, data: { file: url }, message: 'success' });
    }, 300);
  };
  return (
    <Modal
      width={800}
      open={visible}
      okText="确定"
      cancelText="取消"
      title={action === 'create' ? '新增用户' : '编辑用户'}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign="right">
        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="用户名称"
          name="userName"
          rules={[{ required: true, message: '请输入用户名称' }]}
        >
          <Input placeholder="请输入用户名称"></Input>
        </Form.Item>

        <Form.Item
          label="用户邮箱"
          name="userEmail"
          rules={[{ required: true, message: '请输入邮箱' }]}
        >
          <Input placeholder="请输入用户邮箱"></Input>
        </Form.Item>

        <Form.Item
          label="手机号"
          name="mobile"
          rules={[
            { len: 11, message: '请输入11位手机号' },
            { pattern: /1[1-9]\d{9}/, message: '请输入1开头的11位手机号' },
          ]}
        >
          <Input type="number" placeholder="请输入手机号"></Input>
        </Form.Item>

        <Form.Item
          label="部门"
          name="deptName"
          rules={[
            {
              required: true,
              message: '请选择部门',
            },
          ]}
        >
          <TreeSelect
            placeholder="请选择部门"
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            fieldNames={{
              label: 'deptName',
              value: '_id',
              children: 'children',
            }}
            allowClear
            treeData={deptList}
          />
        </Form.Item>
        <Form.Item label="岗位" name="job">
          <Input placeholder="请输入岗位"></Input>
        </Form.Item>

        <Form.Item label="状态" name="state">
          <Select
            options={[
              {
                value: 1,
                label: '在职',
              },
              {
                value: 2,
                label: '离职',
              },
              {
                value: 3,
                label: '试用期',
              },
            ]}
          />
        </Form.Item>

        <Form.Item label="系统角色" name="roleList">
          <Select
            placeholder="请选择角色"
            options={roleList.map(item => ({
              label: item.roleName,
              value: item._id,
            }))}
          />
        </Form.Item>

        <Form.Item label="用户头像">
          <Upload
            showUploadList={false}
            listType="picture-circle"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={customUpload}
          >
            {img ? (
              <img
                src={img}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            ) : (
              <div>
                {loading ? (
                  <LoadingOutlined rev={undefined} />
                ) : (
                  <PlusOutlined rev={undefined} />
                )}
                <div style={{ marginTop: 5 }}>上传头像</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateUser;
