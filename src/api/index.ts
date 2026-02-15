import { db } from "@/db";

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
    return db.query("SELECT * FROM menus WHERE visible = 1 ORDER BY order_num").all();
  },

  getStudentExperiments: () => {
    return db.query("SELECT * FROM experiments ORDER BY module_id, order_num").all();
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
