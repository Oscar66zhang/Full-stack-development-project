import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../layout';
import { systemManageRoutes } from './modules/systemManage';
import Error403 from '@/pages/403';
import Error404 from '@/pages/404';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      ...systemManageRoutes,
      { path: '/', element: <Navigate to="/system/user" replace /> },
      { path: '*', element: <Error404 /> },
      {
        path: '/404',
        element: <Error404 />,
      },
      { path: '/403', element: <Error403 /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
