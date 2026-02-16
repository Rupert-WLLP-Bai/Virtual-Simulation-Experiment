# 全量迁移执行 Prompt（基于 team-v5 模板，面向 Agent Team）

> 用法：把下方 `PROMPT` 代码块整段复制到你的编排器。  
> 目标：一次性完成 `Virtual-Simulation-Experiment -> Virtual-Simulation-Experiment-2026` 的全量功能迁移与验收。

```text
# 🧬 EXTREME AUTONOMOUS ENGINEERING AGENT TEAM（Migration Edition）

## 0) 模式与硬约束（不可协商）
- MUST 使用 Agent Team mode。
- Team Lead 仅做协调，不写实现代码。
- 禁止“单 agent 角色扮演团队”；必须是真实 teammates。
- 禁止使用 subagents。
- Teammates 上限 5（不含 Team Lead）。
- 只能在当前仓库内工作：`/home/pejoy/code/Virtual-Simulation-Experiment-2026`。

## 1) 项目上下文
- 源仓库（Vue）：`/home/pejoy/code/Virtual-Simulation-Experiment`
- 目标仓库（React + Bun）：`/home/pejoy/code/Virtual-Simulation-Experiment-2026`
- 迁移编排文档（source of truth，按优先级）：
  1. `docs/migration/07-branch-feature-matrix.md`（全分支+实验级对照，最高优先级）
  2. `docs/migration/06-review-gate.md`（通过门禁）
  3. `docs/migration/02-task-breakdown.md`
  4. `docs/migration/03-orchestration-graph.md`
  5. `docs/migration/05-branch-source-map.md`
  6. `docs/migration/migration-dag.json`

## 2) MISSION
在不破坏现有可用功能的前提下，完成旧仓库所有实验能力向 2026 仓库迁移，达到“可访问、可输入、可计算、可导出、可回归”的发布标准。

Constraints:
- 保持现有公开路由风格与交互习惯，允许在统一风格前提下重构内部实现。
- 新增/迁移实验必须接入菜单与数据库种子，禁止“代码存在但侧栏不可见”。
- 公式渲染必须正确（乘号应渲染为 `×`，不得显示 `times` 文本残片）。
- 页面可读性必须达标（禁止白底白字、低对比度）。
- 长数字/长文本不得溢出关键容器，输入框必须可编辑。
- 导出（ExportPDF）内容必须可读且不丢关键信息。
- 静态资源引用必须有效（禁止 404 或回退 HTML）。

Success Metrics:
- 覆盖旧实验清单 33 项：全部达到“已迁移可用（A）”。
- 当前 `B` 状态 4 项完成上架并可访问：`dongtaitouzi`, `chongzhiqi`, `shengmingzhouqi`, `mengtekaluo`。
- 当前 `C` 状态 19 项全部实现并接入菜单/路由/种子。
- `bun run build` 通过。
- `bun test --bail` 通过。
- 满足 `docs/migration/06-review-gate.md` 的 Hard Gate 全部项。
- 输出最终对照表：旧仓库分支/实验 -> 新仓库实现路径 -> 验收证据。

## 3) 团队编制（最多 5 人）
默认 5 teammate：
1. Builder A（兼 Architect）：页面迁移与共享组件抽象
2. Builder B：计算逻辑迁移与数据结构对齐
3. Test Engineer：单测/冒烟/回归与样例校验
4. Reviewer（唯一集成 authority）：合并队列、L3 build/test、质量门禁
5. Critic/Red Team：风险攻击、边界条件、反例与回归漏洞捕获

## 4) 本地编排文档（仅本地，禁止提交）
在仓库根目录维护：
- `.agent/STATUS.md`
- `.agent/DECISIONS.md`
- `.agent/TASK_GRAPH.md`
- `.agent/TEST_PLAN.md`
- `.agent/CHANGELOG.md`
- `.agent/PLAYBOOK.md`
- `.agent/RETRO.md`
- `.agent/LOCKS.md`

必须把 `.agent/` 加入 `.gitignore`，且不得出现在 PR 中。

## 5) 工作拓扑（按 DAG 执行）
总体波次（先后依赖）：
- Wave-0（阻断修复与上架）：先收敛已实现未上架与已知可见性问题
- Wave-1（Foundation）：`INF-01~INF-05`
- Wave-2（Parallel EXP）：`EXP-01~EXP-09` + `INF-06` 并行
- Wave-3：`INT-01`
- Wave-4：`INT-02`
- Wave-5：`INT-03`
- Wave-6：`INT-04`

任务与依赖以 `docs/migration/migration-dag.json` 和 `docs/migration/03-orchestration-graph.md` 为准。

## 6) 迁移任务清单（必须全部闭环）
### 6.1 Wave-0（优先清零）
- 任务 W0-1：为 experiments 新增“幂等迁移”路径，确保已有数据库也能补齐新实验种子（不要只依赖首次建库）。
- 任务 W0-2：统一排查公式组件调用，修复 `formula/formulas` 不匹配；全仓扫描公式渲染异常。
- 任务 W0-3：统一处理公式字符串转义，确保渲染后显示乘号而非 `times` 文本。
- 任务 W0-4：修复样式可读性与布局问题（全屏布局、侧栏贴边、白底白字、框体不可见、输入不可操作）。
- 任务 W0-5：修复静态资源路径（logo 等），确保真实图片资产可加载。

### 6.2 Wave-1/2（功能迁移主战场）
- 按 `docs/migration/07-branch-feature-matrix.md` 的实验级对照，把 19 个 `C` 全部迁移为 `A`。
- 对每个实验必须同时完成：
  1. 页面与交互实现
  2. 计算逻辑正确性
  3. 菜单/路由挂载
  4. 数据种子可迁移
  5. 导出与记录链路可用

### 6.3 Wave-3~6（集成收口）
- `INT-01`：全量菜单与权限收口。
- `INT-02`：记录与导出接口收口。
- `INT-03`：全量回归验收，输出缺陷清单并清零 P0/P1。
- `INT-04`：发布封板与迁移对账。

## 7) 并行协议与冲突控制
- 并行按“路径不冲突”拆包，不按角色拆包。
- 同一迭代最多 2 个实现任务并行（Builder A + Builder B）。
- 每个任务开始前必须声明：
  - touched paths
  - owner
  - dependencies
  - validation rule
  - merge risk（LOW/MED/HIGH）
- 修改前先在 `.agent/LOCKS.md` 加锁；无锁不得改代码。
- Reviewer 维护单一集成队列，逐包集成，单包 L3 检查。

## 8) One-Writer Build 机制（强制）
- 仅 Reviewer 可执行官方 L3（全量 build/test）并宣布 RED/GREEN。
- 其他人仅可做 L1/L2 局部验证，不得宣布团队红绿状态。
- L3 RED 时创建 `RED-TICKET`，且仅指定 Fix Owner 可改相关代码，禁止并行抢修。

## 9) Review Gate（硬门禁，逐项打钩）
必须满足 `docs/migration/06-review-gate.md`：
1. build 通过：`bun run build`
2. test 通过：`bun test --bail`
3. 路由可达：侧栏可进入，禁止 404
4. 菜单与数据一致：`src/db/index.ts` 与实际页面映射一致
5. 表单可用：可见、可输入、高对比
6. 导出可读：无白字白底、无内容缺失
7. 静态资源有效：无 404/HTML fallback
8. 计算正确：每个新增/改动算法至少 1 组可复核样例
9. 无调试残留：无临时日志/空按钮/占位假实现

存在任意 `P0/P1` => Fail，不得收敛。

## 10) 执行循环（每轮必须走完）
1. Topology 更新：刷新 `.agent/TASK_GRAPH.md`
2. 微计划评审：每个 owner 提 5-10 条 micro-plan，Reviewer + Critic 先审
3. 并行执行：严格按 lock 和 touched paths
4. 集成排队：Reviewer 单写入集成流
5. Review Gate：BLOCKER/MAJOR/MINOR
6. Critic Gate：至少给出 1 个严重风险 + 2 个红队测试点
7. 修复复审：逐条闭环
8. 文档回写：`.agent/*` 全量更新 + RETRO + PLAYBOOK 规则进化

## 11) 需要重点迁移的实验（按旧清单）
必须最终全部为可用状态（A）：
- `gb11`, `ifpug`, `nesma`, `gb21`, `leibi`, `leitui`, `minjie`,
  `gb31`, `gb41`, `xinxihuapinggu`, `tuiyi`, `qiwangjingxianzhi`,
  `boyi`, `jianhuajisuan`, `yingli`, `changzhai`, `shengcun`,
  `fenxiyupingjia`, `xiaoyi`, `xiaoguo`, `eva`,
  以及当前待上架：`dongtaitouzi`, `chongzhiqi`, `shengmingzhouqi`, `mengtekaluo`。

## 12) 分支取源策略
- 以 `docs/migration/05-branch-source-map.md` 与 `docs/migration/07-branch-feature-matrix.md` 为准。
- `28-SoftwareTestingCostEstimation` 为大多数缺失实验的主来源分支。
- 多来源冲突时，优先“功能完整度”，其次“与 2026 架构一致性”。

## 13) 最终交付物（必须产出）
1. 迁移完成报告（建议：`docs/migration/99-final-migration-report.md`）：
   - 实验级 33/33 对照（旧 key、标题、来源分支、新路径、菜单 path、验证结果）
   - B/C -> A 的闭环证据
   - 已知风险与后续优化（仅 P3）
2. 测试与构建证据：
   - `bun run build` 输出结论
   - `bun test --bail` 输出结论
3. 关键页面验收证据：
   - 公式渲染、长数字溢出、输入可用性、导出可读性
4. 最终 Gate 判定：
   - Pass / Conditional Pass / Fail（按 `06-review-gate.md`）

## 14) 终止条件（全部满足才允许结束）
- 33 个实验全部为 `A-已迁移可用`。
- 无 `P0/P1` 未关闭。
- Hard Gate 全绿。
- Reviewer 批准 + Critic 无重大未决风险。
- 输出 FINAL APPROVED 与完整对照证据。
```
