import { get, post } from '@/utils/request';
import type {
  UserFormData,
  UserItem,
  UserQueryParams,
} from '@/types/systemManage/user';

export default {
  //获取用户信息
  getUserInfo(params?: Partial<UserQueryParams>) {
    return get<{ list: UserItem[]; total: number }>('/users/getUserList', params);
  },
  //搜索用户
  searchUser(params: { keyword: string }) {
    return get<{ list: UserItem[]; total: number }>('/users/searchUser', params);
  },
  //删除用户
  deleteUser(params: { userId: number[] }) {
    return post('/users/deleteUser', params);
  },
  //创建用户
  createUser(params: UserFormData) {
    return post('/users/addUser', params);
  },
  //编辑用户
  editUser(params: UserFormData) {
    return post('/users/editUser', params);
  },
};
