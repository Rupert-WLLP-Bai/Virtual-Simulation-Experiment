import { Database } from "bun:sqlite";

const db = new Database("experiment.db");

// 降低并发访问锁冲突概率（开发时可能存在多个 bun --hot 进程）
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 5000;
  PRAGMA foreign_keys = ON;
`);

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
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    order_num INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS experiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    name TEXT NOT NULL,
    path TEXT UNIQUE NOT NULL,
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
    path TEXT UNIQUE,
    icon TEXT,
    order_num INTEGER DEFAULT 0,
    visible INTEGER DEFAULT 1
  );
`);

// 插入默认数据
const userCount = db.query("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  try {
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
    (2, '动态投资回收期', 'dongtaitouzi', '动态投资回收期计算', 3),
    (2, '重置期', 'chongzhiqi', '重置期分析', 4),
    (2, '生命周期', 'shengmingzhouqi', '软件经济生命周期计算', 5),
    (3, '碳排放权交易', 'tanpaifang', '统一出清价交易模拟', 1),
    (4, '敏感性分析', 'minganxing', '敏感性因素分析', 1),
    (4, '不确定性决策', 'buqueding', '不确定环境决策', 2),
    (4, '测试成本估算', 'testcost', '软件测试成本估算', 3),
    (4, '蒙特卡洛模拟', 'montecarlo', '蒙特卡洛风险模拟', 4),
    (5, '决策树分析', 'decisiontree', '决策树风险分析', 1);

    INSERT INTO menus (parent_id, name, path, icon, order_num) VALUES
    (NULL, '首页', '/home', 'home', 1),
    (NULL, '实验中心', '/experiments', 'flask', 2),
    (2, '软件度量', '/exp1/cosmic', 'ruler', 1),
    (2, '投资评价', '/exp7/jinxianzhi', 'trending-up', 2),
    (2, '碳排放交易', '/exp6/tanpaifang', 'leaf', 3),
    (2, '不确定性决策', '/exp9/buqueding', 'help-circle', 4),
    (2, '蒙特卡洛模拟', '/exp4/montecarlo', 'dice', 5),
    (NULL, '个人中心', '/personal', 'user', 3);
  `);
  } catch (error) {
    console.error("[db] bootstrap seed skipped:", error);
  }
}

// 升级迁移：对旧数据库先去重，再建立唯一约束，保证后续种子可幂等执行
try {
  db.exec(`
  BEGIN IMMEDIATE;

  -- 旧版本可能存在重复模块名：先把 experiments.module_id 归并到保留记录
  UPDATE experiments
  SET module_id = (
    SELECT MIN(m_keep.id)
    FROM modules m_keep
    WHERE m_keep.name = (
      SELECT m_old.name
      FROM modules m_old
      WHERE m_old.id = experiments.module_id
    )
  )
  WHERE module_id IS NOT NULL;

  -- 删除重复模块（按 name 保留最小 id）
  DELETE FROM modules
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM modules
    GROUP BY name
  );

  -- 删除重复实验（按 path 保留最小 id）
  DELETE FROM experiments
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM experiments
    GROUP BY path
  );

  -- 删除重复菜单（仅 path 非空的记录去重）
  DELETE FROM menus
  WHERE path IS NOT NULL
    AND id NOT IN (
      SELECT MIN(id)
      FROM menus
      WHERE path IS NOT NULL
      GROUP BY path
    );

  -- 旧库不一定有 UNIQUE 约束，显式补齐唯一索引
  CREATE UNIQUE INDEX IF NOT EXISTS idx_modules_name_unique ON modules(name);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_experiments_path_unique ON experiments(path);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_menus_path_unique ON menus(path) WHERE path IS NOT NULL;

  -- 历史错误路径修正
  UPDATE menus
  SET path = '/exp47/montecarlo'
  WHERE path = '/exp4/montecarlo';

  UPDATE experiments
  SET description = '统一出清价交易模拟'
  WHERE path = 'tanpaifang';

  COMMIT;
`);
} catch (error) {
  try {
    db.exec("ROLLBACK;");
  } catch {
    // ignore
  }
  console.error("[db] migration block skipped:", error);
}

// 幂等补种：依赖唯一索引 + INSERT OR IGNORE，支持已有数据库升级
try {
  db.exec(`
  INSERT OR IGNORE INTO modules (name, description, order_num) VALUES
  ('测试成本', '软件测试成本估算', 4);

  INSERT OR IGNORE INTO experiments (module_id, name, path, description, order_num) VALUES
  ((SELECT id FROM modules WHERE name = '投资评价'), '动态投资回收期', 'dongtaitouzi', '动态投资回收期计算', 3),
  ((SELECT id FROM modules WHERE name = '投资评价'), '重置期', 'chongzhiqi', '重置期分析', 4),
  ((SELECT id FROM modules WHERE name = '投资评价'), '生命周期', 'shengmingzhouqi', '软件经济生命周期计算', 5),
  ((SELECT id FROM modules WHERE name = '不确定性决策'), '蒙特卡洛模拟', 'montecarlo', '蒙特卡洛风险模拟', 4);

  INSERT OR IGNORE INTO menus (name, path, icon, order_num) VALUES
  ('动态投资回收期', '/exp7/dongtaitouzi', 'clock', 6),
  ('重置期', '/exp7/chongzhiqi', 'refresh-cw', 7),
  ('生命周期', '/exp7/shengmingzhouqi', 'cycle', 8),
  ('蒙特卡洛模拟', '/exp47/montecarlo', 'dice', 9);

  -- C-1: 软件度量类实验（10个）
  INSERT OR IGNORE INTO experiments (module_id, name, path, description, order_num) VALUES
  ((SELECT id FROM modules WHERE name = '软件度量'), 'GB11国标功能点', 'gb11', 'GB11国标功能点度量', 4),
  ((SELECT id FROM modules WHERE name = '软件度量'), 'IFPUG功能点', 'ifpug', 'IFPUG功能点度量', 5),
  ((SELECT id FROM modules WHERE name = '软件度量'), 'NESMA功能点', 'nesma', 'NESMA功能点度量', 6),
  ((SELECT id FROM modules WHERE name = '软件度量'), 'GB21国标功能点', 'gb21', 'GB21国标功能点度量', 7),
  ((SELECT id FROM modules WHERE name = '软件度量'), '类比法估算', 'leibi', '类比法软件规模估算', 8),
  ((SELECT id FROM modules WHERE name = '软件度量'), '类推法估算', 'leitui', '类推法软件规模估算', 9),
  ((SELECT id FROM modules WHERE name = '软件度量'), '敏捷方法估算', 'minjie', '敏捷方法故事点估算', 10),
  ((SELECT id FROM modules WHERE name = '软件度量'), 'GB31国标功能点', 'gb31', 'GB31国标功能点度量', 11),
  ((SELECT id FROM modules WHERE name = '软件度量'), 'GB41国标功能点', 'gb41', 'GB41国标功能点度量', 12),
  ((SELECT id FROM modules WHERE name = '软件度量'), '信息化评估', 'xinxihuapinggu', '信息化项目评估', 13);

  INSERT OR IGNORE INTO menus (name, path, icon, order_num) VALUES
  ('GB11国标功能点', '/exp1/gb11', 'file-text', 10),
  ('IFPUG功能点', '/exp1/ifpug', 'file-text', 11),
  ('NESMA功能点', '/exp1/nesma', 'file-text', 12),
  ('GB21国标功能点', '/exp2/gb21', 'file-text', 13),
  ('类比法估算', '/exp2/leibi', 'git-compare', 14),
  ('类推法估算', '/exp2/leitui', 'arrow-right', 15),
  ('敏捷方法估算', '/exp2/minjie', 'zap', 16),
  ('GB31国标功能点', '/exp3/gb31', 'file-text', 17),
  ('GB41国标功能点', '/exp4/gb41', 'file-text', 18),
  ('信息化评估', '/exp2/xinxihuapinggu', 'bar-chart-2', 19);

  -- C-2: 投资评价类实验（6个）
  INSERT OR IGNORE INTO experiments (module_id, name, path, description, order_num) VALUES
  ((SELECT id FROM modules WHERE name = '投资评价'), '博弈论决策', 'boyi', '博弈论投资决策', 6),
  ((SELECT id FROM modules WHERE name = '投资评价'), '期望净现值法', 'qiwangjingxianzhi', '期望净现值法投资决策', 7),
  ((SELECT id FROM modules WHERE name = '投资评价'), '简化计算模型', 'jianhuajisuan', '投资决策简化计算', 8),
  ((SELECT id FROM modules WHERE name = '投资评价'), '盈利能力分析', 'yingli', '投资项目盈利能力分析', 9),
  ((SELECT id FROM modules WHERE name = '投资评价'), '偿债能力分析', 'changzhai', '投资项目偿债能力分析', 10),
  ((SELECT id FROM modules WHERE name = '投资评价'), '生存能力分析', 'shengcun', '投资项目生存能力分析', 11);

  INSERT OR IGNORE INTO menus (name, path, icon, order_num) VALUES
  ('博弈论决策', '/exp8/boyi', 'git-branch', 20),
  ('期望净现值法', '/exp8/qiwangjingxianzhi', 'trending-up', 21),
  ('简化计算模型', '/exp10/jianhuajisuan', 'calculator', 22),
  ('盈利能力分析', '/exp10/yingli', 'dollar-sign', 23),
  ('偿债能力分析', '/exp10/changzhai', 'credit-card', 24),
  ('生存能力分析', '/exp10/shengcun', 'activity', 25);

  -- C-3: 分析评价类实验（4个）
  INSERT OR IGNORE INTO experiments (module_id, name, path, description, order_num) VALUES
  ((SELECT id FROM modules WHERE name = '决策树'), '分析与评价', 'fenxiyupingjia', '软件项目分析与评价', 2),
  ((SELECT id FROM modules WHERE name = '决策树'), '效益分析', 'xiaoyi', '软件项目效益分析', 3),
  ((SELECT id FROM modules WHERE name = '决策树'), '效果分析', 'xiaoguo', '软件项目效果分析', 4),
  ((SELECT id FROM modules WHERE name = '决策树'), 'EVA挣值分析', 'eva', '挣值分析进度成本控制', 5);

  INSERT OR IGNORE INTO menus (name, path, icon, order_num) VALUES
  ('分析与评价', '/exp11/fenxiyupingjia', 'pie-chart', 26),
  ('效益分析', '/exp12/xiaoyi', 'trending-up', 27),
  ('效果分析', '/exp13/xiaoguo', 'target', 28),
  ('EVA挣值分析', '/exp14/eva', 'activity', 29);
`);
} catch (error) {
  console.error("[db] idempotent seed skipped:", error);
}

export { db };
export default db;
