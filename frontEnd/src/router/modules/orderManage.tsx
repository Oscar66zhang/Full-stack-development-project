import DriverList from '@/pages/orderManage/driverList';
import DriverDist from '@/pages/orderManage/driverDist';
import OrderList from '@/pages/orderManage/orderList';

export const orderManageRoutes = [
  { path: 'order/driverList', element: <DriverList /> },
  { path: 'order/driverDist', element: <DriverDist /> },
  { path: 'order/orderList', element: <OrderList /> },
];
