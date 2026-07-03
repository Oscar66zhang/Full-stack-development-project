import { get, post } from '@/utils/request';

import type {
  OrderItem,
  CreateParams,
  SearchParams,
  OrderRoute,
} from '@/types/orderManage/orderList';

export default {
  getOrderList() {
    return get<{
      list: OrderItem[];
      total: number;
      pageSize: number;
      pageNum: number;
    }>('/order/getOrderList');
  },
  createOrderList(data: CreateParams) {
    return post('/order/createOrderList', data);
  },
  searchOrder(params: SearchParams) {
    return get<OrderItem[]>('/order/searchOrderList', params);
  },
  exportOrder() {
    return get('/order/exportOrderList', {}, { responseType: 'blob' });
  },
};
