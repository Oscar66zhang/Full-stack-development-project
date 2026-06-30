import request from '@/utils/request';
import type { UserFormData, UserItem } from '@/types/systemManage/user';

export default {
  //获取用户信息
  getUserInfo() {
    return request.get<{ list: UserItem[]; totle: number }>(
      '/users/getUserList'
    );
  },
  //删除用户
  deleteUser(params: { userId: number[] }) {
    return request.post('/users/deleteUser', params);
  },
  //创建用户
  createUser(params: UserFormData) {
    return request.post('/users/addUser', params);
  },
  //编辑用户
  editUser(params: UserFormData) {
    return request.post('/users/editUser', params);
  },
};
