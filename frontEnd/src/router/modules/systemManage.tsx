import { lazy } from 'react';

// 懒加载页面组件
const Dept = lazy(() => import('@/pages/systemManage/dept'));
const Menu = lazy(() => import('@/pages/systemManage/menu'));
const Role = lazy(() => import('@/pages/systemManage/role'));
const User = lazy(() => import('@/pages/systemManage/user'));

export const systemManageRoutes = [
  { path: 'system/dept', element: <Dept /> },
  { path: 'system/menu', element: <Menu /> },
  { path: 'system/role', element: <Role /> },
  { path: 'system/user', element: <User /> },
];
