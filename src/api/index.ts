import { db } from "@/db";

const FALLBACK_MODULES = [
  { id: 1, name: "软件度量", description: "软件规模度量实验", order_num: 1 },
  { id: 2, name: "投资评价", description: "投资决策评价实验", order_num: 2 },
  { id: 3, name: "碳排放交易", description: "碳排放权交易模拟", order_num: 3 },
  { id: 4, name: "风险分析", description: "风险分析与评价", order_num: 4 },
  { id: 5, name: "综合评价", description: "综合分析与评价", order_num: 5 },
];

const FALLBACK_EXPERIMENTS = [
  { id: 1, module_id: 1, name: "COSMIC功能点度量", path: "cosmic", order_num: 1 },
  { id: 2, module_id: 1, name: "MARK II功能点度量", path: "markii", order_num: 2 },
  { id: 3, module_id: 1, name: "单方案财务评价", path: "singlescheme", order_num: 3 },
  { id: 4, module_id: 1, name: "GB11国标功能点", path: "gb11", order_num: 4 },
  { id: 5, module_id: 1, name: "IFPUG功能点", path: "ifpug", order_num: 5 },
  { id: 6, module_id: 1, name: "NESMA功能点", path: "nesma", order_num: 6 },
  { id: 7, module_id: 1, name: "GB21国标功能点", path: "gb21", order_num: 7 },
  { id: 8, module_id: 1, name: "类比法估算", path: "leibi", order_num: 8 },
  { id: 9, module_id: 1, name: "类推法估算", path: "leitui", order_num: 9 },
  { id: 10, module_id: 1, name: "敏捷方法估算", path: "minjie", order_num: 10 },
  { id: 11, module_id: 1, name: "GB31国标功能点", path: "gb31", order_num: 11 },
  { id: 12, module_id: 1, name: "GB41国标功能点", path: "gb41", order_num: 12 },
  { id: 13, module_id: 1, name: "信息化评估", path: "xinxihuapinggu", order_num: 13 },
  { id: 14, module_id: 2, name: "NPV/IRR评价", path: "jinxianzhi", order_num: 1 },
  { id: 15, module_id: 2, name: "盈亏平衡分析", path: "yinkuipingheng", order_num: 2 },
  { id: 16, module_id: 2, name: "动态投资回收期", path: "dongtaitouzi", order_num: 3 },
  { id: 17, module_id: 2, name: "重置期", path: "chongzhiqi", order_num: 4 },
  { id: 18, module_id: 2, name: "生命周期", path: "shengmingzhouqi", order_num: 5 },
  { id: 19, module_id: 2, name: "博弈论决策", path: "boyi", order_num: 6 },
  { id: 20, module_id: 2, name: "期望净现值法", path: "qiwangjingxianzhi", order_num: 7 },
  { id: 21, module_id: 2, name: "简化计算模型", path: "jianhuajisuan", order_num: 8 },
  { id: 22, module_id: 2, name: "盈利能力分析", path: "yingli", order_num: 9 },
  { id: 23, module_id: 2, name: "偿债能力分析", path: "changzhai", order_num: 10 },
  { id: 24, module_id: 2, name: "生存能力分析", path: "shengcun", order_num: 11 },
  { id: 25, module_id: 3, name: "碳排放权交易", path: "tanpaifang", order_num: 1 },
  { id: 26, module_id: 4, name: "敏感性分析", path: "minganxing", order_num: 1 },
  { id: 27, module_id: 4, name: "不确定性决策", path: "buqueding", order_num: 2 },
  { id: 28, module_id: 4, name: "测试成本估算", path: "testcost", order_num: 3 },
  { id: 29, module_id: 4, name: "蒙特卡洛模拟", path: "montecarlo", order_num: 4 },
  { id: 30, module_id: 4, name: "决策树分析", path: "decisiontree", order_num: 5 },
  { id: 31, module_id: 5, name: "分析与评价", path: "fenxiyupingjia", order_num: 1 },
  { id: 32, module_id: 5, name: "效益分析", path: "xiaoyi", order_num: 2 },
  { id: 33, module_id: 5, name: "效果分析", path: "xiaoguo", order_num: 3 },
  { id: 34, module_id: 5, name: "EVA挣值分析", path: "eva", order_num: 4 },
];

function withDBFallback<T>(query: () => T, fallback: T): T {
  try {
    return query();
  } catch (error) {
    console.error("[api] sqlite fallback:", error);
    return fallback;
  }
}

// 认证 API
export const authAPI = {
  login: (username: string, password: string) => {
    const user = db.query("SELECT * FROM users WHERE username = ?").get(username) as any;
    if (user && user.password_hash === password) {
      const { password_hash, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token: `token-${user.id}-${Date.now()}` };
    }
    throw new Error("用户名或密码错误");
  },

  register: (username: string, password: string, name: string) => {
    try {
      const result = db.query(
        "INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, 'student')"
      ).run(username, password, name);
      return { id: result.lastInsertRowid, username, name };
    } catch (e) {
      throw new Error("用户名已存在");
    }
  },

  getUser: (id: number) => {
    const user = db.query("SELECT id, username, name, role FROM users WHERE id = ?").get(id);
    return user;
  },
};

// 菜单 API
export const menuAPI = {
  getMenus: () => {
    return withDBFallback(
      () => db.query("SELECT * FROM menus WHERE visible = 1 ORDER BY order_num").all(),
      []
    );
  },

  getStudentExperiments: () => {
    return withDBFallback(
      () => db.query("SELECT * FROM experiments ORDER BY module_id, order_num").all(),
      FALLBACK_EXPERIMENTS
    );
  },

  getModules: () => {
    return withDBFallback(
      () => db.query("SELECT * FROM modules ORDER BY order_num").all(),
      FALLBACK_MODULES
    );
  },
};

// 实验记录 API
export const experimentAPI = {
  saveRecord: (userId: number, experimentId: string, data: unknown, score?: number) => {
    const result = db.query(
      "INSERT INTO experiment_records (user_id, experiment_id, data_json, score) VALUES (?, ?, ?, ?)"
    ).run(userId, experimentId, JSON.stringify(data), score ?? null);
    return { id: result.lastInsertRowid };
  },

  getRecords: (userId: number) => {
    return db.query("SELECT * FROM experiment_records WHERE user_id = ? ORDER BY completed_at DESC").all(userId);
  },

  getRecord: (id: number) => {
    return db.query("SELECT * FROM experiment_records WHERE id = ?").get(id);
  },
};

export default { authAPI, menuAPI, experimentAPI };
