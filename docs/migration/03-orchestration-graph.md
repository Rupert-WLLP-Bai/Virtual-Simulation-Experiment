# 迁移编排图（Topology + Parallelism）

## Mermaid DAG
```mermaid
graph TD
  INF01[INF-01 基线冻结]
  INF02[INF-02 统一UI基线]
  INF03[INF-03 路由与菜单契约]
  INF04[INF-04 静态资产策略]
  INF05[INF-05 计算引擎扩展]
  INF06[INF-06 回归测试框架]

  EXP01[EXP-01 现有页面补全]
  EXP02[EXP-02 规模度量扩展]
  EXP03[EXP-03 开发成本估算]
  EXP04[EXP-04 测试/运维/绩效国标]
  EXP05[EXP-05 投资评价扩展]
  EXP06[EXP-06 风险分析扩展]
  EXP07[EXP-07 财务分析主线]
  EXP08[EXP-08 费用效果评估]
  EXP09[EXP-09 EVA监督控制]

  INT01[INT-01 菜单与权限收口]
  INT02[INT-02 记录与导出收口]
  INT03[INT-03 全量回归验收]
  INT04[INT-04 发布与封板]

  INF01 --> INF02
  INF01 --> INF03
  INF01 --> INF04
  INF01 --> INF05
  INF02 --> INF06
  INF03 --> INF06

  INF02 --> EXP01
  INF03 --> EXP01
  INF04 --> EXP01

  INF02 --> EXP02
  INF03 --> EXP02

  INF02 --> EXP03
  INF03 --> EXP03
  INF05 --> EXP03

  INF02 --> EXP04
  INF03 --> EXP04

  INF02 --> EXP05
  INF03 --> EXP05
  INF05 --> EXP05

  INF02 --> EXP06
  INF03 --> EXP06
  INF05 --> EXP06

  INF02 --> EXP07
  INF03 --> EXP07
  INF05 --> EXP07

  INF02 --> EXP08
  INF03 --> EXP08
  INF05 --> EXP08

  INF02 --> EXP09
  INF03 --> EXP09
  INF05 --> EXP09

  EXP01 --> INT01
  EXP02 --> INT01
  EXP03 --> INT01
  EXP04 --> INT01
  EXP05 --> INT01
  EXP06 --> INT01
  EXP07 --> INT01
  EXP08 --> INT01
  EXP09 --> INT01

  INT01 --> INT02
  INT02 --> INT03
  INF06 --> INT03
  INT03 --> INT04
```

## 并行批次建议（Topological Waves）
- Wave-0：`INF-01`
- Wave-1（可并行）：`INF-02`、`INF-03`、`INF-04`、`INF-05`
- Wave-2（可并行）：`INF-06`、`EXP-01`、`EXP-02`、`EXP-03`、`EXP-04`、`EXP-05`、`EXP-06`、`EXP-07`、`EXP-08`、`EXP-09`
- Wave-3：`INT-01`
- Wave-4：`INT-02`
- Wave-5：`INT-03`
- Wave-6：`INT-04`

## 关键拓扑关系
- `INF-03`（路由/菜单契约）是所有实验任务可集成的前置。
- `INF-05`（计算引擎扩展）是财务与评估类实验的核心前置。
- `INT-01` 必须等待全部 EXP 任务完成后统一收口，避免菜单反复改动冲突。
- `INT-03` 依赖 `INF-06` 的测试框架与 `INT-02` 的功能收口结果。
