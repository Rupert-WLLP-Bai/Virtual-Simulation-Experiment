# Virtual-Simulation-Experiment 迁移编排总索引

## 文档列表
- `docs/migration/01-gap-inventory.md`：旧仓库到 2026 仓库的迁移缺口矩阵（已迁移/部分迁移/未迁移）。
- `docs/migration/02-task-breakdown.md`：可执行任务清单（任务ID、依赖、并行性、产出、建议子agent）。
- `docs/migration/03-orchestration-graph.md`：拓扑关系图（Mermaid）+ 分层并行批次。
- `docs/migration/04-subagent-playbook.md`：子agent编排手册（职责边界、输入输出契约、冲突处理）。
- `docs/migration/05-branch-source-map.md`：任务与旧分支来源映射（便于子agent取源）。
- `docs/migration/06-review-gate.md`：Review 通过门禁（阻断项、证据要求、Pass/Fail标准）。
- `docs/migration/07-branch-feature-matrix.md`：旧仓库全分支功能迁移详细对照表（分支级+实验级+子agent分配）。
- `docs/migration/08-full-migration-team-prompt.md`：基于 team-v5 的“全量迁移执行 Prompt”（可直接投喂 agent team）。
- `docs/migration/09-reference-verification-remediation.md`：联网参考资料对照后的正确性修复清单（P1/P2、并行编排、验收样例）。
- `docs/migration/migration-dag.json`：机器可读 DAG（便于调度器直接消费）。

## 迁移范围基准
- 源仓库：`/home/pejoy/code/Virtual-Simulation-Experiment`（Vue）。
- 目标仓库：`/home/pejoy/code/Virtual-Simulation-Experiment-2026`（React + Bun）。
- 旧实验基线：`front/src/pages/exp*/**` 目录下实验页。
- 当前目标实验基线：`src/pages/exp*/**/index.tsx` + `src/db/index.ts` 的实验种子数据。

## 当前阶段目标
- 阶段1：把“已存在但未挂载/未完成”的实验补齐到可用状态。
- 阶段2：按模块并行迁移缺失实验。
- 阶段3：统一菜单/路由/导出/实验记录链路并完成回归验收。
