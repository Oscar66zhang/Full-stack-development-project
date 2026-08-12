import { get, post } from '@/utils/request';
import type { LoginParams, LoginResult } from '@/types/auth';
import type { UserItem } from '@/types/systemManage/user';

export interface RegisterParams {
  userName: string;
  userEmail: string;
  password: string;
  confirmPassword: string;
}

export const authApi = {
  login(params: LoginParams) {
    return post<LoginResult>('/auth/login', params);
  },
  register(params: RegisterParams) {
    return post('/auth/register', params);
  },
  logout() {
    return post('/auth/logout');
  },
  getCurrentUser() {
    return get<UserItem>('/auth/me');
  },
};
