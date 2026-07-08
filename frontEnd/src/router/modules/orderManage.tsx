import { lazy } from 'react';

const OrderList = lazy(() => import('@/pages/orderManage/orderList'));
const DriverDist = lazy(() => import('@/pages/orderManage/driverDist'));
const DriverList = lazy(() => import('@/pages/orderManage/driverList'));

export const orderManageRoutes = [
  { path: 'order/orderList', element: <OrderList /> },
  { path: 'order/driverDist', element: <DriverDist /> },
  { path: 'order/driverList', element: <DriverList /> },
];