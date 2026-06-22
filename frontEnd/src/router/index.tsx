import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../layout';
import { systemManageRoutes } from './modules/systemManage';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      ...systemManageRoutes,
      { path: '/', element: <Navigate to="/system/user" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
