import React, { useEffect, useState } from 'react';
import {
  PieChartOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  CrownOutlined,
  ApartmentOutlined,
  BarsOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  EnvironmentOutlined,
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
  getItem('系统管理', 'sub1', <SettingOutlined />, [
    getItem('用户管理', '/system/user', <TeamOutlined />),
    getItem('角色管理', '/system/role', <CrownOutlined />),
    getItem('部门管理', '/system/dept', <ApartmentOutlined />),
    getItem('菜单管理', '/system/menu', <BarsOutlined />),
  ]),
  getItem('订单管理', 'sub2', <UnorderedListOutlined />, [
    getItem('订单列表', '/order/orderList', <ShoppingCartOutlined />),
    getItem('司机分布', '/order/driverDist', <EnvironmentOutlined />),
    getItem('司机列表', '/order/driverList', <CarOutlined />),
  ]),
];

const SideMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/system')) {
      setOpenKeys(['sub1']);
    } else if (location.pathname.startsWith('/order')) {
      setOpenKeys(['sub2']);
    }
  }, [location.pathname]);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  const handleClickLogo = () => {
    navigate('/welcome');
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value: boolean) => setCollapsed(value)}
    >
      {collapsed ? (
        <div className="h-16 flex items-center justify-center bg-gray-800 cursor-pointer">
          <img src="/imgs/YunCheng.png" className="h-[30px]" />
        </div>
      ) : (
        <div
          className="h-16 flex items-center justify-center gap-5  bg-gray-800 cursor-pointer"
          onClick={handleClickLogo}
        >
          <img src="/imgs/YunCheng.png" className="h-[40px] w-[40px]" />
          <span className="text-white text-lg  font-semibold whitespace-nowrap">
            云程
          </span>
        </div>
      )}

      <Menu
        theme="dark"
        selectedKeys={[location.pathname]}
        mode="inline"
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={keys => setOpenKeys(keys)}
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default SideMenu;
