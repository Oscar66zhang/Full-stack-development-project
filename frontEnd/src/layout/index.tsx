import React from 'react';
import { Layout, theme } from 'antd';
import SideMenu from '@/components/Menu';
import NavHeader from '@/components/NavHeader';
import NavFooter from '@/components/NavFooter';
import { Outlet } from 'react-router-dom';
const { Content } = Layout;

const LayoutPage: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu />
      <Layout>
        <NavHeader />
        <Content style={{ margin: '0 6px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <NavFooter />
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
