import { get, post } from '@/utils/request';
import type {
  MenuItem,
  CreateParams,
  EditParams,
  Params,
} from '@/types/systemManage/menu';

export default {
  //获取菜单信息
  getMenuList() {
    return get<MenuItem[]>('/menu/getMenuList');
  },
};
