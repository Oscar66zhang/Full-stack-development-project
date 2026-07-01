import { get, post } from '@/utils/request';
import type {
  MenuItem,
  CreateParams,
  EditParams,
  Params,
  DelParams,
} from '@/types/systemManage/menu';

export default {
  //获取菜单信息
  getMenuList(params?: Partial<Params>) {
    return get<MenuItem[]>('/menu/getMenuList', params);
  },
  //添加菜单
  createMenu(data: CreateParams) {
    return post<CreateParams[]>('/menu/addMenu', data);
  },
  //编辑菜单
  editMenu(data: EditParams) {
    return post<EditParams[]>('/menu/editMenu', data);
  },
  //删除菜单
  deleteMenu(params: { _id: string }) {
    return post<DelParams>('/menu/deleteMenu', params);
  },
};
