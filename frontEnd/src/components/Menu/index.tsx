import React, { useState } from 'react';
import {
  PieChartOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('工作台', '1', <PieChartOutlined />),
  getItem('系统管理', 'sub1', <UserOutlined />, [
    getItem('用户管理', '2'),
    getItem('角色管理', '3'),
    getItem('部门管理', '4'),
    getItem('菜单管理', '5'),
  ]),
  getItem('订单管理', 'sub2', <UnorderedListOutlined />, [
    getItem('订单列表', '6'),
    getItem('订单聚合', '8'),
  ]),
];

const SideMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value: boolean) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default SideMenu;
