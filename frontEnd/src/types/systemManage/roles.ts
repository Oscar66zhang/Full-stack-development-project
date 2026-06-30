//角色管理
export interface PageParams {
  pageNum: number;
  pageSize?: number;
}

export interface Params extends PageParams {
  roleName?: string;
}

export interface CreateParams {
  roleName: string;
  remark?: string;
}

export interface RoleItem extends CreateParams {
  _id: string;
  permissionList: {
    checkedKeys: string[];
    halfCheckedKeys: string[];
  };
  updateTime: string;
  createTime: string;
}

export interface EditParams extends CreateParams {
  _id: string;
}

export interface Permission {
  _id: string;
  permissionList: {
    checkedKeys: string[];
    halfCheckedKeys: string[];
  };
}
