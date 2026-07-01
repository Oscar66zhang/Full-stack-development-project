import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Form, message, Modal, Tree, type TreeProps } from 'antd';
import type { IModalProp, IAction, IModalRef } from '@/types/modal';
import type { RoleItem, Permission } from '@/types/systemManage/roles';
import type { MenuItem } from '@/types/systemManage/menu';
import { menuApi, rolesApi } from '@/api/index';

const SetPermission = forwardRef<IModalRef<RoleItem>, IModalProp>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [roleInfo, setRoleInfo] = useState<RoleItem>();
    const [permission, setPermission] = useState<Permission>();

    //获取菜单列表
    const getMenuList = async () => {
      const res = await menuApi.getMenuList();
      setMenuList(res.data);
    };

    useEffect(() => {
      getMenuList();
    }, []);

    // 打开弹窗的方法
    // type：表示当前操作类型，比如 create / edit / delete
    // data：编辑时传入的当前行数据
    const open = useCallback((type: IAction, data?: RoleItem) => {
      setVisible(true);
      setRoleInfo(data);
      setCheckedKeys(data?.permissionList?.checkedKeys || []);
      setPermission(undefined);
    }, []);

    useImperativeHandle(ref, () => ({
      open,
    }));

    //========================================操作按钮========================================
    //提交按钮
    const handleSubmit = async () => {
      if (!permission) {
        message.warning('请先选择权限');
        return;
      }
      const params = permission || {
        _id: roleInfo?._id,
        permissionList: roleInfo?.permissionList,
      };

      const res = await rolesApi.updatePermission(params);
      message.success(res.message || '权限设置成功');

      setVisible(false);
      setPermission(undefined);
      props.update();
    };

    //取消按钮
    const handleCancel = () => {
      setVisible(false);
      setPermission(undefined);
    };

    //树形控件勾选事件
    const onCheck: TreeProps<MenuItem>['onCheck'] = (
      checkedKeysValue,
      info
    ) => {
      const currentCheckedKeys = Array.isArray(checkedKeysValue)
        ? checkedKeysValue
        : checkedKeysValue.checked;
      setCheckedKeys(currentCheckedKeys);

      const permissionCheckedKeys: string[] = [];
      const parentKeys: string[] = [];
      info.checkedNodes.forEach(node => {
        if (node.menuType === 2) {
          permissionCheckedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });
      setPermission({
        _id: roleInfo?._id || '',
        permissionList: {
          checkedKeys: permissionCheckedKeys,
          halfCheckedKeys: [
            ...parentKeys,
            ...(info.halfCheckedKeys || []).map(String),
          ],
        },
      });
    };

    return (
      <Modal
        title="设置权限"
        width={600}
        open={visible}
        okText="确定"
        cancelText="取消"
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form labelAlign="right" labelCol={{ span: 4 }}>
          <Form.Item label="角色名称">{roleInfo?.roleName}</Form.Item>

          <Form.Item label="权限">
            <Tree<MenuItem>
              checkable
              defaultExpandAll
              checkedKeys={checkedKeys}
              treeData={menuList}
              fieldNames={{
                title: 'menuName',
                key: '_id',
                children: 'children',
              }}
              onCheck={onCheck}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default SetPermission;
