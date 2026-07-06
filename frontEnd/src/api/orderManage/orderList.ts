import { get, post } from '@/utils/request';

import type {
  OrderItem,
  CreateParams,
  SearchParams,
} from '@/types/orderManage/orderList';

export default {
  //获取订单列表
  getOrderList() {
    return get<{
      list: OrderItem[];
      total: number;
      pageSize: number;
      pageNum: number;
    }>('/order/getOrderList');
  },

  //查看订单详情
  getOrderDetail(orderId: string) {
    return get<OrderItem>(`/order/getOrderDetail/${orderId}`);
  },

  //创建订单列表
  createOrderList(data: CreateParams) {
    return post('/order/createOrderList', data);
  },
  //搜索订单列表
  searchOrder(params: SearchParams) {
    return get<{
      list: OrderItem[];
      total: number;
      pageSize: number;
      pageNum: number;
    }>('/order/searchOrderList', params);
  },
  //导出订单列表
  exportOrder() {
    return get('/order/exportOrderList', undefined, {
      responseType: 'blob',
    }) as unknown as Promise<Blob>;
  },

  //删除订单
  deleteOrderList(_id: string) {
    return post(`/order/deleteOrderList/${_id}`);
  },

  //更新订单打点
  updateOrderRoute(params: {
    _id: string;
    route: Array<{ lng: string; lat: string }>;
  }) {
    return post<OrderItem>('/order/updateOrderRoute', params);
  },
};
