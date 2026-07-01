export interface Params {
  menuName: string;
  menuState: number;
}
// 菜单创建
export interface CreateParams {
  menuName: string; // 菜单名称
  icon?: string; // 菜单图标
  menuType: number; // 1: 菜单 2：按钮 3：页面
  menuState: number; // 1：正常 2：停用
  menuCode?: string; // 按钮权限标识
  parentId?: string; // 父级菜单ID
  path?: string; // 菜单路径
  component?: string; // 组件名称
  children?: MenuItem[];
}
export interface MenuItem extends CreateParams {
  _id: string;
  createTime: string;
  buttons?: MenuItem[];
}
export interface EditParams extends CreateParams {
  _id?: string;
}

export interface DelParams {
  _id: string;
}
