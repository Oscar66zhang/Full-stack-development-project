import type { RefObject } from 'react';;

/** 弹窗操作类型：新增 / 编辑 / 删除 */
export type IAction = 'create' | 'edit' | 'delete';

/**
 * 通用弹窗组件 Props 类型
 * @description 用于新增、编辑、删除等通用弹窗，支持所有业务模块
 */
export interface IModalProp<T = unknown> {
  /**
   * 父组件传入的 ref
   * 用于调用子组件内部的 open 方法，打开弹窗
   */
  mRef: RefObject<{
    /**
     * 打开弹窗方法
     * @param type 操作类型（新增/编辑/删除）
     * @param data 操作的数据（编辑/删除时必传，新增时可不传）
     */
    open: (type: IAction, data?: T) => void;
  } | null>;

  /**
   * 弹窗操作完成后的刷新列表方法
   * 提交成功后调用，重新获取数据
   */
  update: () => void;
}

/**
 * 详情页弹窗 Props 类型
 * @description 只用于查看详情，不需要 update 刷新
 */
export interface IDetailProp {
  /**
   * 父组件传入的 ref
   * 用于调用子组件的 open 方法，打开详情弹窗
   */
  mRef: RefObject<{
    /**
     * 打开详情弹窗
     * @param orderId 要查看的订单/数据ID
     */
    open: (orderId: string) => void;
  } | null>;
}
