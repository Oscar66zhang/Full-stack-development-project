import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/dashBoard'));

export const dashBoardRoutes = [{ path: 'dashboard', element: <Dashboard /> }];
