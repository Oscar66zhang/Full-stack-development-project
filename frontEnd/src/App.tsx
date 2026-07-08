import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import AntdGlobal from './utils/AntdGlobal';
import { useStore } from '@/store';
function App() {
  const { isDark } = useStore();
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#eb6c00',
        },
      }}
    >
      <AntdApp>
        <AntdGlobal />
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
