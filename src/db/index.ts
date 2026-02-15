import { Database } from "bun:sqlite";

const db = new Database("experiment.db");

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    order_num INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS experiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    description TEXT,
    order_num INTEGER DEFAULT 0,
    FOREIGN KEY (module_id) REFERENCES modules(id)
  );

  CREATE TABLE IF NOT EXISTS experiment_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    experiment_id TEXT NOT NULL,
    data_json TEXT,
    score REAL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    name TEXT NOT NULL,
    path TEXT,
    icon TEXT,
    order_num INTEGER DEFAULT 0,
    visible INTEGER DEFAULT 1
  );
`);

// 插入默认数据
const userCount = db.query("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.exec(`
    INSERT INTO users (username, password_hash, name, role) VALUES
    ('admin', 'admin123', '管理员', 'admin'),
    ('student', '123456', '学生', 'student');

    INSERT INTO modules (name, description, order_num) VALUES
    ('软件度量', '软件规模度量实验', 1),
    ('投资评价', '投资决策评价实验', 5),
    ('碳排放交易', '碳排放权交易模拟', 6),
    ('不确定性决策', '不确定环境下的决策', 9),
    ('决策树', '决策树分析', 10);

    INSERT INTO experiments (module_id, name, path, description, order_num) VALUES
    (1, 'COSMIC功能点度量', 'cosmic', 'COSMIC方法度量软件功能规模', 1),
    (1, 'MARK II功能点度量', 'markii', 'MARK II方法度量软件功能规模', 2),
    (1, '单方案财务评价', 'singlescheme', '单方案投资评价', 3),
    (2, 'NPV/IRR评价', 'jinxianzhi', '净现值与内部收益率评价', 1),
    (2, '盈亏平衡分析', 'yinkuipingheng', '盈亏平衡点分析', 2),
    (3, '碳排放权交易', 'tanpaifang', 'Vickrey拍卖模拟', 1),
    (4, '敏感性分析', 'minganxing', '敏感性因素分析', 1),
    (4, '不确定性决策', 'buqueding', '不确定环境决策', 2),
    (4, '测试成本估算', 'testcost', '软件测试成本估算', 3),
    (5, '决策树分析', 'decisiontree', '决策树风险分析', 1);

    INSERT INTO menus (parent_id, name, path, icon, order_num) VALUES
    (NULL, '首页', '/home', 'home', 1),
    (NULL, '实验中心', '/experiments', 'flask', 2),
    (2, '软件度量', '/exp1/cosmic', 'ruler', 1),
    (2, '投资评价', '/exp7/jinxianzhi', 'trending-up', 2),
    (2, '碳排放交易', '/exp6/tanpaifang', 'leaf', 3),
    (2, '不确定性决策', '/exp9/buqueding', 'help-circle', 4),
    (NULL, '个人中心', '/personal', 'user', 3);
  `);
}

export { db };
export default db;
