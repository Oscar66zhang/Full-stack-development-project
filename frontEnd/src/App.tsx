import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';
import { ConfigProvider, App as AntdApp } from 'antd';
import AntdGlobal from './utils/AntdGlobal';
function App() {
  return (
    <ConfigProvider
      theme={{
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
