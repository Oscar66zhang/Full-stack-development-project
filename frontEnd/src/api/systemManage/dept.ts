import { get, post } from '@/utils/request';
import type {
  DeptItem,
  EditParams,
  CreateParams,
  DelParams,
  Params,
} from '@/types/systemManage/dept';

export default {
  //获取部门列表
  getDeptList(params?: Partial<Params>) {
    return get<DeptItem[]>('/dept/getDeptList', params);
  },
  //编辑部门列表
  editDepList(data: EditParams) {
    return post<EditParams[]>('/dept/editDept', data);
  },
  //添加部门列表
  createDeptList(data: CreateParams) {
    return post<CreateParams[]>('/dept/addDept', data);
  },
  //删除部门列表
  deleteDepList(params: DelParams) {
    return post('/dept/deleteDept', params);
  },
  //搜索部门列表
  searchDeptList(params?: Partial<Params>) {
    return get<DeptItem[]>('/dept/searchDeptList', params);
  },
};
