import Dept from '@/pages/systemManage/dept';
import Menu from '@/pages/systemManage/menu';
import Role from '@/pages/systemManage/role';
import User from '@/pages/systemManage/user';

export const systemManageRoutes = [
  { path: 'system/dept', element: <Dept /> },
  { path: 'system/menu', element: <Menu /> },
  { path: 'system/role', element: <Role /> },
  { path: 'system/user', element: <User /> },
];
