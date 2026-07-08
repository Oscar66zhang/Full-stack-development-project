import React from 'react';
import { MenuFoldOutlined, FullscreenOutlined, FullscreenExitOutlined, SunOutlined, MoonOutlined, UserOutlined, SettingOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Layout, theme, Dropdown, type MenuProps } from 'antd';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';
import { useStore } from '@/store';

const { Header } = Layout;

const NavHeader: React.FC = () => {
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const { isDark, updateTheme } = useStore();

  const routeMap: Record<string, { title: string; parent?: string }> = {
    '/welcome': { title: '首页' },
    '/dashboard': { title: '工作台', parent: '首页' },
    '/system/user': { title: '用户管理', parent: '系统管理' },
    '/system/role': { title: '角色管理', parent: '系统管理' },
    '/system/dept': { title: '部门管理', parent: '系统管理' },
    '/system/menu': { title: '菜单管理', parent: '系统管理' },
    '/order/orderList': { title: '订单列表', parent: '订单管理' },
    '/order/driverDist': { title: '司机分布', parent: '订单管理' },
    '/order/driverList': { title: '司机列表', parent: '订单管理' },
  };

  type BreadcrumbItem = { key?: string; title: React.ReactNode };

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const route = routeMap[path];

    if (!route) {
      return [{ key: '/welcome', title: <span>首页</span> }];
    }

    const items: BreadcrumbItem[] = [];

    items.push({
      key: '/welcome',
      title: <span>首页</span>,
    });

    if (route.parent) {
      items.push({
        key: route.parent,
        title: <span>{route.parent}</span>,
      });
    }

    items.push({
      key: path,
      title: <span style={{ color: '#eb6c00', fontWeight: 500 }}>{route.title}</span>,
    });

    return items;
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 主题切换
  const toggleTheme = () => {
    updateTheme(!isDark);
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <PoweroffOutlined />,
      label: '退出登录',
      danger: true,
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
      <div className="flex items-center" style={{ padding: 20 }}>
        <MenuFoldOutlined />
        <Breadcrumb
          items={getBreadcrumbItems() as any}
          style={{ marginLeft: 10 }}
        />
      </div>

      {/* 右侧 */}
      <div className="flex items-center gap-4">
        {/* 全屏切换 */}
        <span
          onClick={toggleFullscreen}
          className="cursor-pointer text-base hover:text-[#eb6c00]"
        >
          {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </span>

        {/* 主题切换 */}
        <span
          onClick={toggleTheme}
          className="cursor-pointer text-base hover:text-[#eb6c00]"
        >
          {isDark ? <SunOutlined /> : <MoonOutlined />}
        </span>

        {/* 用户下拉菜单 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#eb6c00] text-white flex items-center justify-center">
              <UserOutlined />
            </div>
            <span className="text-sm">Admin</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavHeader;
