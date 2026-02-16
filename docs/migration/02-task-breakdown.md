# 迁移任务拆解（Task Breakdown）

## 任务设计原则
- 每个任务有明确输入、输出、依赖，便于子agent独立执行。
- 业务模块迁移与基础设施分离，先稳基座再并行搬模块。
- 统一以 `src/pages/exp*/...` + `src/lib/calc/*` + `src/db/index.ts` 为落地点。

## A. 基础设施任务（Foundation）
| 任务ID | 任务 | 主要内容 | 依赖 | 建议子agent | 产出 |
|---|---|---|---|---|---|
| INF-01 | 基线冻结 | 固化旧仓库实验目录清单、分支来源映射、验收口径 | 无 | Orchestrator | `01-gap-inventory.md` 更新 |
| INF-02 | 统一UI基线 | 表单输入/表格/按钮/PDF导出卡片统一样式与可读性 | INF-01 | UI-Agent | `src/index.css` + 公共样式类 |
| INF-03 | 路由与菜单契约 | 统一实验路由命名、侧栏映射、数据库 `experiments` 种子策略 | INF-01 | Infra-Agent | `src/pages/experiment/index.tsx` + `src/db/index.ts` |
| INF-04 | 静态资产策略 | 旧仓库 logo/指导书/图像资源迁移规则（import优先） | INF-01 | Asset-Agent | `src/assets`（或等价目录）+资源映射表 |
| INF-05 | 计算引擎扩展 | 抽取并扩展财务与评估计算库，避免页面重复实现 | INF-01 | Calc-Agent | `src/lib/calc/*` 新增/增强 |
| INF-06 | 回归测试框架 | 建立单元+页面冒烟+关键链路（导出、输入、菜单）测试 | INF-02, INF-03 | QA-Agent | 测试脚本与基线报告 |

## B. 实验模块迁移任务（可并行）
| 任务ID | 模块范围 | 旧实验目录 | 依赖 | 建议子agent | 产出 |
|---|---|---|---|---|---|
| EXP-01 | 现有页面补全 | `MENGTEKALUO`、`TEST1` | INF-02, INF-03, INF-04 | Stabilize-Agent | `montecarlo` 菜单挂载；`testcost` 从占位升级为完整实验 |
| EXP-02 | 规模度量扩展 | `GB11`、`GUOBIAO`、`IFPUG`、`NESMA` | INF-02, INF-03 | FP-Agent | `src/pages/exp1/*` 新增页面与计算 |
| EXP-03 | 开发成本估算 | `CHENGBENGUSUAN`、`GB21`、`LEIBI`、`LEITUI`、`MINJIE` | INF-02, INF-03, INF-05 | DevCost-Agent | `src/pages/exp2/*` |
| EXP-04 | 测试/运维/绩效国标 | `GB31`、`GB41`、`GB51` | INF-02, INF-03 | StdCost-Agent | `src/pages/exp3/*`、`exp4/*`、`exp5/*` |
| EXP-05 | 投资评价扩展 | `DONGTAITOUZI`、`CHONGZHIQI`、`SHENGMINGZHOUQI` | INF-02, INF-03, INF-05 | Investment-Agent | `src/pages/exp7/*` 扩展实验 |
| EXP-06 | 风险分析扩展 | `QIWANGJINGXIANZHI`、`BOYI` | INF-02, INF-03, INF-05 | Risk-Agent | `src/pages/exp8/*` 扩展实验 |
| EXP-07 | 财务分析主线 | `JIANHUAJISUAN`、`YINGLI`、`CHANGZHAI`、`SHENGCUN`、`FENXIYUPINGJIA` | INF-02, INF-03, INF-05 | Finance-Agent | `src/pages/exp10/*`、`exp11/*` |
| EXP-08 | 费用效果评估 | `XIAOYI`、`XIAOGUO` | INF-02, INF-03, INF-05 | Benefit-Agent | `src/pages/exp12/*`、`exp13/*` |
| EXP-09 | EVA监督控制 | `EVA` | INF-02, INF-03, INF-05 | EVA-Agent | `src/pages/exp14/*` |

## C. 集成收敛任务（Integration）
| 任务ID | 任务 | 主要内容 | 依赖 | 建议子agent | 产出 |
|---|---|---|---|---|---|
| INT-01 | 菜单与权限收口 | 所有新增实验统一挂载 `experiments/modules/menus` | EXP-01..EXP-09 | Infra-Agent | 可访问的全量实验菜单 |
| INT-02 | 记录与导出收口 | 实验记录、PDF导出、文件下载能力统一接口 | INT-01 | Data-Agent | 统一记录/导出行为 |
| INT-03 | 全量回归验收 | 单元、页面、关键路径回归，生成缺陷清单 | INT-02, INF-06 | QA-Agent | 验收报告 |
| INT-04 | 发布与迁移封板 | 版本说明、迁移对账、残留风险清单 | INT-03 | Orchestrator | Release Checklist |

## 推荐执行顺序（拓扑层）
1. INF-01
2. INF-02 / INF-03 / INF-04 / INF-05（并行）
3. INF-06（可与实验迁移并行推进）
4. EXP-01 / EXP-02 / EXP-03 / EXP-04 / EXP-05 / EXP-06 / EXP-07 / EXP-08 / EXP-09（大并行）
5. INT-01
6. INT-02
7. INT-03
8. INT-04

## 建议里程碑
- Milestone A：完成 INF-01~INF-05，形成稳定迁移基座。
- Milestone B：完成 EXP-01（先把已有能力补齐可演示）。
- Milestone C：完成 EXP-02~EXP-09 的第一批并行迁移。
- Milestone D：完成 INT-01~INT-04，进入发布。
