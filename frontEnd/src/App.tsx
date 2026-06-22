import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';
import { ConfigProvider } from 'antd';
function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#eb6c00',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
