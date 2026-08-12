import { authApi } from '@/api';
import { useStore } from '@/store';
import { Spin } from 'antd';
import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const token = useStore(state => state.token);
  const updateUserInfo = useStore(state => state.updateUserInfo);
  const [checking, setChecking] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    let active = true;
    authApi
      .getCurrentUser()
      .then(response => {
        if (active) updateUserInfo(response.data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [token, updateUserInfo]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" tip="正在验证登录状态..." />
      </div>
    );
  }

  return children;
};

export default AuthGuard;
