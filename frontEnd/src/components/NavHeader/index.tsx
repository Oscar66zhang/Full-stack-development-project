import React from 'react';
import { MenuFoldOutlined } from '@ant-design/icons';
import { Layout, theme, type MenuProps } from 'antd';
import { Breadcrumb, Switch, Dropdown } from 'antd';
const { Header } = Layout;
const NavHeader: React.FC = () => {
  const breadList = [
    {
      key: 'home',
      title: <span style={{ color: '#000' }}>首页</span>,
    },
    {
      key: 'work',
      title: <span style={{ color: '#000' }}>工作台</span>,
    },
  ];

  const items: MenuProps['item'] = [
    {
      key: 'email',
      label: '邮箱:',
    },
    {
      key: 'logout',
      label: '退出',
    },
  ];

  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();

  return (
    <div
      className="flex justify-between items-center h-16 px-4 w-full"
      style={{
        backgroundColor: colorBgContainer,
        color: colorText,
      }}
    >
      {/* 左侧 */}
      <div className="flex items-center" style={{ color: '#000', padding: 20 }}>
        <MenuFoldOutlined />
        <Breadcrumb items={breadList} style={{ marginLeft: 10 }} />
      </div>
      {/* 右侧 */}
      <div></div>
    </div>
  );
};

export default NavHeader;
