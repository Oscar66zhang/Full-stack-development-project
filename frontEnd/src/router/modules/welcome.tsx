import { lazy } from 'react';

const Welcome = lazy(() => import('@/pages/welcome/index'));

export const welcomeRoutes = [
  {
    path: '/welcome',
    element: <Welcome />,
  },
];
