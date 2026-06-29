import React, { useMemo, useState } from 'react';
import {
  PieChartOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

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
  getItem('工作台', '/dashboard', <PieChartOutlined />),
  getItem('系统管理', 'sub1', <UserOutlined />, [
    getItem('用户管理', '/system/user'),
    getItem('角色管理', '/system/role'),
    getItem('部门管理', '/system/dept'),
    getItem('菜单管理', '/system/menu'),
  ]),
  getItem('订单管理', 'sub2', <UnorderedListOutlined />, [
    getItem('订单列表', '/order/list'),
    getItem('订单聚合', '/order/aggregate'),
  ]),
];

const SideMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openKeys = useMemo(() => {
    if (location.pathname.startsWith('/system')) {
      return ['sub1'];
    }
    if (location.pathname.startsWith('/order')) {
      return ['sub1'];
    }

    return [];
  }, [location.pathname]);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value: boolean) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        selectedKeys={[location.pathname]}
        mode="inline"
        openKeys={collapsed ? [] : openKeys}
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default SideMenu;
