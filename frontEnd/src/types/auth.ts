import type { UserItem } from '@/types/systemManage/user';

export interface LoginParams {
  account: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userInfo: UserItem;
}
