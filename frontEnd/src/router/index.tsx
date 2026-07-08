import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../layout';
import { systemManageRoutes } from './modules/systemManage';
import { orderManageRoutes } from './modules/orderManage';
import { dashBoardRoutes } from './modules/dashboardManage';
import { welcomeRoutes } from './modules/welcome';
import Error403 from '@/pages/403';
import Error404 from '@/pages/404';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      ...dashBoardRoutes,
      ...systemManageRoutes,
      ...orderManageRoutes,
      ...welcomeRoutes,
      { path: '/', element: <Navigate to="/welcome" replace /> },
      { path: '/404', element: <Error404 /> },
      { path: '/403', element: <Error403 /> },
      { path: '*', element: <Error404 /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
