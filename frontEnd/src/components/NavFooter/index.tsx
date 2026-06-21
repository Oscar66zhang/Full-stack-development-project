import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const NavFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©{currentYear} Created by Ant UED
    </Footer>
  );
};

export default NavFooter;
