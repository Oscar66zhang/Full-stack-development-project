import { get, post } from '@/utils/request';
import type {
  RoleItem,
  CreateParams,
  EditParams,
  Params,
  Permission,
} from '@/types/systemManage/roles';

export default {
  //获取角色信息

  // Partial：把某个类型里的所有属性都变成可选属性
  getRoleList(params?: Partial<Params>) {
    return get<{ list: RoleItem[]; total: number }>(
      '/roles/getRoleList',
      params
    );
  },

  createRole(data: CreateParams) {
    return post('/roles/addRole', data);
  },
  editRole(data: EditParams) {
    return post('/roles/editRole', data);
  },
  deleteRole(params: { _id: string }) {
    return post('/roles/deleteRole', params);
  },

  updatePermission(data: Permission) {
    return post('/roles/updatePermission', data);
  },
};
