// 订单管理 - 订单相关类型

export interface PageParams {
  pageNum: number;
  pageSize?: number;
}

export const OrderState = {
  doing: 1,
  done: 2,
  timeout: 3,
  cance: 4,
} as const;

export type OrderState = (typeof OrderState)[keyof typeof OrderState];

export interface CreateParams {
  cityName: string;
  userName: string;
  driverName: string;
  vehicleName: string;
  driverAmount: number;
  mobile?: number;
  startAddress?: string; // 下单开始地址
  endAddress?: string; // 下单结束地址
  orderAmount?: number; // 订单金额
  userPayAmount?: number; // 支付金额
  payType?: number; // 支付方式 1: 微信 2：支付宝
  state?: OrderState; // 订单状态 1: 进行中 2: 已完成 3: 超时 4: 取消
  useTime?: string; // 用车时间
  endTime?: string; // 订单结束时间
}

export interface OrderItem extends CreateParams {
  _id: string;
  orderId: string; // 订单ID
  route: Array<{ lng: string; lat: string }>; // 行驶轨迹
  createTime: string; // 创建时间
  remark: string; // 备注
}

export interface SearchParams {
  orderId?: string;
  userName?: string;
  state?: OrderState;
}

export interface Params extends PageParams {
  orderId?: string;
  userName?: string;
  state?: OrderState;
}

export interface OrderRoute {
  orderId: string; // 订单ID
  route: Array<{ lng: string; lat: string }>;
}
