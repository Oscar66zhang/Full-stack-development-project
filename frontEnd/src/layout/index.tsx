import React from 'react';
import { Layout, theme } from 'antd';
import SideMenu from '@/components/Menu';
import NavHeader from '@/components/NavHeader';
import NavFooter from '@/components/NavFooter';
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
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              marginTop: 20,
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Bill is a cat.
          </div>
        </Content>
        <NavFooter />
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
