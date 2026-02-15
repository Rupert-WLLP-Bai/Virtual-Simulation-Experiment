import { create } from "zustand";

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

interface MenuState {
  menus: MenuItem[];
  setMenus: (menus: MenuItem[]) => void;
}

// 模拟菜单数据
const mockMenus: MenuItem[] = [
  {
    id: "home",
    name: "首页",
    path: "/home",
    icon: "home",
  },
  {
    id: "experiments",
    name: "实验中心",
    path: "/experiments",
    icon: "flask",
    children: [
      { id: "exp1", name: "软件度量", path: "/exp1/cosmic" },
      { id: "exp5", name: "单方案评价", path: "/exp5/singlescheme" },
      { id: "exp6", name: "碳排放交易", path: "/exp6/tanpaifang" },
      { id: "exp7", name: "NPV/IRR评价", path: "/exp7/jinxianzhi" },
      { id: "exp7-be", name: "盈亏平衡", path: "/exp7/yinkuipingheng" },
      { id: "exp8", name: "敏感性分析", path: "/exp8/minganxing" },
      { id: "exp9", name: "不确定性决策", path: "/exp9/buqueding" },
      { id: "exp10", name: "决策树", path: "/exp10/decisiontree" },
      { id: "exp47", name: "蒙特卡洛", path: "/exp47/montecarlo" },
    ],
  },
  {
    id: "personal",
    name: "个人中心",
    path: "/personal",
    icon: "user",
  },
];

export const useMenuStore = create<MenuState>((set) => ({
  menus: mockMenus,
  setMenus: (menus) => set({ menus }),
}));
