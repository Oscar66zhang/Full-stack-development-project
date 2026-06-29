import request from '@/utils/request';
import type { UserItem } from '@/types/systemManage/user';

export default {
  //获取用户信息
  getUserInfo() {
    return request.get<{ list: UserItem[]; totle: number }>(
      '/users/getUserList'
    );
  },
};
