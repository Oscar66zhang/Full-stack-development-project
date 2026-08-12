import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../layout';
import { systemManageRoutes } from './modules/systemManage';
import { orderManageRoutes } from './modules/orderManage';
import { dashBoardRoutes } from './modules/dashboardManage';
import { welcomeRoutes } from './modules/welcome';
import AuthGuard from './AuthGuard';

// 懒加载 Error 页面
const Error403Component = lazy(() => import('@/pages/403'));
const Error404Component = lazy(() => import('@/pages/404'));
const LoginComponent = lazy(() => import('@/pages/login'));
const RegisterComponent = lazy(() => import('@/pages/login/components/Register'));

//Loading组件
const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
      <span className="text-gray-500">Loading...</span>
    </div>
  );
};

// 包装懒加载组件
const LazyElement: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

export const routes = [
  {
    path: '/login',
    element: (
      <LazyElement>
        <LoginComponent />
      </LazyElement>
    ),
  },
  {
    path: '/register',
    element: (
      <LazyElement>
        <RegisterComponent />
      </LazyElement>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      ...dashBoardRoutes,
      ...systemManageRoutes,
      ...orderManageRoutes,
      ...welcomeRoutes,
      { path: '/', element: <Navigate to="/welcome" replace /> },
      {
        path: '/404',
        element: (
          <LazyElement>
            <Error404Component />
          </LazyElement>
        ),
      },
      {
        path: '/403',
        element: (
          <LazyElement>
            <Error403Component />
          </LazyElement>
        ),
      },
      {
        path: '*',
        element: (
          <LazyElement>
            <Error404Component />
          </LazyElement>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
