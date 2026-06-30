import request from '@/utils/request';
import type { DeptItem } from '@/types/systemManage/dept';

export default {
  getDeptList() {
    return request.get<DeptItem[]>('/dept/getDeptList');
  },
};
