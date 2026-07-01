import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Form, message, Modal, Tree } from 'antd';
import type { IModalProp, IAction, IModalRef } from '@/types/modal';
import type { RoleItem, Permission } from '@/types/systemManage/roles';
import type { MenuItem } from '@/types/systemManage/menu';
import { menuApi, rolesApi } from '@/api/index';
import type { Key } from 'react';

const SetPermission = forwardRef<IModalRef<MenuItem>, IModalProp>(
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

    return <div>SetPermission</div>;
  }
);

export default SetPermission;
