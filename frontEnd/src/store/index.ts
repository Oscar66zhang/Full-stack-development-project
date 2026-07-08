//Zustand 做全局状态管理
import { create } from 'zustand';
import type { UserItem } from '@/types/systemManage/user';
import storage from '@/utils/storage';

// 创建全局状态仓库
export const useStore = create<{
  // 登录 token
  token: string;

  // 当前登录用户信息
  userInfo: UserItem;

  // 左侧菜单是否折叠
  collapsed: boolean;

  // 是否开启暗黑模式
  isDark: boolean;

  // 更新 token
  updateToken: (token: string) => void;

  // 更新用户信息
  updateUserInfo: (userInfo: UserItem) => void;

  // 切换菜单折叠状态
  updateCollapsed: () => void;

  // 更新主题模式
  updateTheme: (isDark: boolean) => void;
}>(set => ({
  // token 初始值
  token: '',

  // 用户信息初始值，避免页面一开始取值时报 undefined
  userInfo: {
    _id: '',
    userId: 0,
    userName: '',
    userEmail: '',
    deptId: '',
    state: 0,
    mobile: '',
    job: '',
    role: 0,
    roleList: '',
    createId: 0,
    deptName: '',
    userImg: '',
  },

  // 默认左侧菜单不折叠
  collapsed: false,

  // 从本地缓存读取主题状态，没有就默认 false，也就是浅色模式
  isDark: storage.get('isDark') || false,

  // 保存登录 token 到全局状态
  updateToken: token => set({ token }),

  // 更新暗黑模式状态
  updateTheme: isDark => set({ isDark }),

  // 保存当前登录用户信息
  updateUserInfo: (userInfo: UserItem) => set({ userInfo }),

  // 切换左侧菜单展开 / 折叠
  updateCollapsed: () =>
    set(state => {
      return {
        collapsed: !state.collapsed,
      };
    }),
}));
