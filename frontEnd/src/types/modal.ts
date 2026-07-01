import type { ReactNode } from 'react';

/** 弹窗操作类型：新增 / 编辑 / 删除 */
export type IAction = 'create' | 'edit' | 'delete';

/** 通用弹窗 ref 类型----子组件暴露给父组件调用的方法 */
export interface IModalRef<T = unknown> {
  open: (type: IAction, data?: T) => void;
}

/** 通用弹窗 props 类型-----父组件传给子组件的数据 / 方法 */
export interface IModalProp {
  update: () => void;
  children?: ReactNode;
}

/** 详情页弹窗 ref 类型 */
export interface IDetailRef {
  open: (orderId: string) => void;
}

/** 详情页 props 类型 */
export interface IDetailProp {
  children?: ReactNode;
}
