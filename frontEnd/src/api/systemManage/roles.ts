import request from '@/utils/request';
import type { RoleItem } from '@/types/systemManage/roles';

export default {
  //获取角色信息
  getRoleList() {
    return request.get<{ list: RoleItem[]; total: number }>(
      '/roles/getRoleList'
    );
  },
};
