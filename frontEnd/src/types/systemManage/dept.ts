//部门管理
export interface Params {
  deptName?: string;
}
export interface CreateParams {
  deptName: string;
  parentId?: string;
  userName: string;
}
export interface EditParams extends CreateParams {
  _id: string;
}
export interface DelParams {
  _id: string;
}
export interface DeptItem {
  _id: string;
  createTime: string;
  updateTime: string;
  deptName: string;
  parentId: string;
  userName: string;
  children: DeptItem[];
}
