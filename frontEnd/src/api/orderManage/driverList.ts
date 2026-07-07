import { get, post } from '@/utils/request';

import type {
  DriverItem,
  DriverParams,
  CreateDriverParams,
} from '@/types/orderManage/driverList';

export default {
  //获取司机列表
  getDriverList: (params?: DriverParams) => {
    return get<{ list: DriverItem[] }>('/order/getDriverList', params);
  },
  //创建司机列表
  createDriverList: (data: CreateDriverParams) => {
    return post('/order/createDriver', data);
  },
  //编辑司机列表
  updateDriver: (driverId: number, data: Partial<CreateDriverParams>) => {
    return post(`/order/updateDriver/${driverId}`, data);
  },
  //删除司机列表
  deleteDriverList: (deviceId: number) => {
    return post(`/order/deleteDriver/${deviceId}`);
  },
  //搜索司机列表
  searchDriverList: (params: DriverParams) => {
    return get<{ list: DriverItem[] }>('/order/searchDriver', params);
  },
};
