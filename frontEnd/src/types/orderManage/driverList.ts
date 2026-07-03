// 司机管理 - 司机相关类型

export const DriverStatus = {
  auth: 0, // 待认证
  normal: 1, // 正常
  temp: 2, // 暂时拉黑
  always: 3, // 永久拉黑
  stop: 4, // 停止推送
} as const;

export type DriverStatus = (typeof DriverStatus)[keyof typeof DriverStatus];

export interface DriverParams {
  driverName?: string;
  accountStatus?: number;
}

export interface DriverItem {
  driverName: string; // 司机名称
  driverId: number; // 司机ID
  driverPhone: string; // 司机手机号
  cityName: string; // 城市名称
  grade: boolean; // 会员等级
  driverLevel: number; // 司机等级
  accountStatus: DriverStatus; // 司机状态
  carNo: string; // 车牌号
  vehicleBrand: string; // 车辆品牌
  vehicleName: string; // 车辆名称
  onlineTime: number; // 昨日在线时长
  driverAmount: number; // 昨日司机流水
  rating: number; // 司机评分
  driverScore: number; // 司机行为分
  pushOrderCount: number; // 昨日推单数
  orderCompleteCount: number; // 昨日完单数
  createTime: string; // 创建时间
}
