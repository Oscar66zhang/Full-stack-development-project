// ============ 分页 ============
export interface UserPageParams {
  pageNum: number;
  pageSize: number;
}

// ============ 用户类型 ============
export interface UserItem {
  _id: string;
  userId: number;
  userName: string;
  userEmail: string;
  deptId: string;
  state: number;
  mobile: string;
  job: string;
  role: number;
  roleList: string;
  createId: number;
  deptName: string;
  userImg: string;
}

export interface UserParams extends UserPageParams {
  userId?: number;
  userName?: string;
  state?: number;
}

export interface UserCreateParams {
  userName: string;
  userEmail: string;
  mobile?: number;
  deptId: string;
  job?: string;
  state?: number;
  roleList: string[];
  userImg: string;
}

export interface UserEditParams extends UserCreateParams {
  userId: number;
}

export interface UserFormData extends UserCreateParams {
  userId?: number;
}
