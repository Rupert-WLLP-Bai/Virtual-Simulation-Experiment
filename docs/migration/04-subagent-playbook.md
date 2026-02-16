# 子Agent编排手册（Subagent Playbook）

## 角色与边界
| 子agent | 负责任务 | 不负责内容 | 交付物 |
|---|---|---|---|
| Orchestrator-Agent | INF-01、INT-04 | 具体页面实现 | 计划更新、里程碑状态、封板报告 |
| Infra-Agent | INF-03、INT-01 | 业务计算公式细节 | 路由、菜单、DB 种子、接口契约 |
| UI-Agent | INF-02 | 业务逻辑迁移 | 统一样式基线、组件规范 |
| Asset-Agent | INF-04 | 业务计算实现 | 资产映射、可打包资源路径 |
| Calc-Agent | INF-05 | 菜单挂载 | 通用计算库、单元测试 |
| Stabilize-Agent | EXP-01 | 新实验大规模迁移 | 已有实验补全、占位页替换 |
| FP-Agent | EXP-02 | 其他模块 | 规模度量实验页与计算 |
| DevCost-Agent | EXP-03 | 其他模块 | 开发成本实验页与计算 |
| StdCost-Agent | EXP-04 | 其他模块 | 测试/运维/绩效国标实验 |
| Investment-Agent | EXP-05 | 其他模块 | 投资评价扩展实验 |
| Risk-Agent | EXP-06 | 其他模块 | 风险分析扩展实验 |
| Finance-Agent | EXP-07 | 其他模块 | 财务分析主线实验 |
| Benefit-Agent | EXP-08 | 其他模块 | 费用-效益/效果实验 |
| EVA-Agent | EXP-09 | 其他模块 | EVA实验 |
| Data-Agent | INT-02 | 页面视觉 | 实验记录与导出统一链路 |
| QA-Agent | INF-06、INT-03 | 新需求设计 | 自动化回归与验收报告 |

## 子agent输入/输出契约
- 输入统一包含：任务ID、依赖已完成清单、目标文件路径、验收标准。
- 输出统一包含：改动文件列表、未决问题、测试结果、后续交接项。
- 每个子agent提交后，必须附 `self-check`：
  - 是否修改了非本任务文件。
  - 是否引入了菜单/路由冲突。
  - 是否通过本任务最小测试集。

## 冲突规避策略
- 文件所有权分区：
  - `src/lib/calc/*` 仅 Calc-Agent 主写，其他 agent 通过接口调用。
  - `src/db/index.ts`、`src/pages/experiment/index.tsx` 仅 Infra-Agent 主写。
  - `src/index.css` 与公共UI仅 UI-Agent 主写。
- 合并顺序：Foundation 分支先合，再并行实验分支，最后 Integration 分支。
- 若并行任务触及同一文件，按“接口先合入、页面后对接”原则处理。

## 编排节奏建议
1. 启动 Orchestrator-Agent 完成 INF-01，冻结任务边界。
2. 并行拉起 INF-02/03/04/05。
3. INF 稳定后并行拉起 EXP 任务（可按模块优先级分批）。
4. 汇总到 INT-01/02，再由 QA-Agent 执行 INT-03。
5. Orchestrator-Agent 执行 INT-04 封板。
