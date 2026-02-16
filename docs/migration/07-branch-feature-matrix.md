# 旧仓库全分支功能迁移详细对照表

## 数据基线
- 源仓库：`/home/pejoy/code/Virtual-Simulation-Experiment`
- 目标仓库：`/home/pejoy/code/Virtual-Simulation-Experiment-2026`
- 旧实验清单来源：`front/src/mock/experiment.js`
- 新仓库路由实现来源：`src/pages/experiment/index.tsx`
- 新仓库当前数据库上架状态来源：`experiment.db` 中 `experiments` 表

## 状态定义
- `A-已迁移可用`：代码已实现，且当前数据库已有条目，侧栏可见。
- `B-已实现待上架`：代码已实现，但当前数据库无条目（现有库不会显示）。
- `C-未迁移`：目标仓库暂无对应页面实现。
- `N-无独立增量`：该分支相对旧 `main` 无独立功能增量，或仅历史合并/杂项。

## 1) 分支级对照（全分支）
| 分支 | 旧分支主要增量（相对旧 main） | 对照结果 |
|---|---|---|
| `main` | 旧系统基线（含大部分实验目录） | 基线来源 |
| `master` | 与 `main` 无 merge-base 的历史主线 | 历史分支，不作为迁移基线 |
| `10_LLYZ` | 无页面独立增量 | `N` |
| `111_DanFangAn` | `exp11/FENXIYUPINGJIA` + 图片 | `C`（`fenxiyupingjia` 未迁移） |
| `12_huangjinjiangbeizu` | 大量环境/依赖差异（含 node_modules） | `N`（不建议作为功能迁移来源） |
| `13_COSMIC_SoftwareScaleMeasurement` | COSMIC 相关页面和素材 | `A`（核心功能已迁） |
| `16_yinkuipingheng` | 盈亏平衡页面 | `A` |
| `18_MARK_II` | 无页面独立增量 | `N` |
| `19_SensitivityAnalysisMethod` | 敏感性分析 + 菜单改动 | `A`（核心已迁） |
| `20_IRR&NPV` | NPV/IRR 页面 | `A` |
| `21_EVA` | 无页面独立增量 | `N` |
| `22_economic_life` | 无页面独立增量 | `N` |
| `26_DPP` | 无页面独立增量 | `N` |
| `28-SoftwareTestingCostEstimation` | 大批实验页面（核心增量来源） | 部分迁移（见实验级对照） |
| `29_mondaytravel` | `TANPAIFANG61` | `A` |
| `32_decision_tree` | 无页面独立增量 | `N` |
| `33_unclecherry` | 无页面独立增量 | `N` |
| `35_carbon` | 碳交易页面与资产 | `A`（核心已迁） |
| `36_UncertaintyEstimation` | 不确定性分析 | `A` |
| `39_123` | 无页面独立增量 | `N` |
| `3_BreakEvenPoint` | 盈亏平衡页面 | `A` |
| `40_caiwupingjia` | 无页面独立增量 | `N` |
| `41_pgdg` | 单方案财务评价 | `A` |
| `43_COSMIC` | COSMIC 页面 | `A` |
| `44_COSMIC` | 无页面独立增量 | `N` |
| `47_MonteCarloMethod` | 无页面独立增量 | `N`（分支名有 MonteCarlo，但无页面差异） |
| `48_LoveMeIfBug` | 敏感性分析调整 | `A`（核心已迁） |
| `51_SingleScheme` | 单方案页面 + 菜单调整 | `A`（核心已迁） |
| `8_costEstimation` | 无页面独立增量 | `N` |
| `9_CBZGtestcost` | 无页面独立增量 | `N` |
| `YangH` | 无页面独立增量 | `N` |
| `dev_Stepin` | 基础菜单缓存行为调整 | `N`（非实验功能） |
| `vvvviolet_main` | 流程图/文档类 | `N` |
| `wwj` | logo/下载相关提交信息 | 部分吸收（资源策略未完全对齐） |
| `zsp` | 合并分支 | `N` |

## 2) 实验功能级详细对照（旧 33 项）
| 旧实验 key | 旧标题 | 主要来源分支 | 2026 实现路径 | 当前库上架 | 状态 |
|---|---|---|---|---|---|
| `gb11` | 国标GB标准-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `ifpug` | IFPUG-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `nesma` | NESMA-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `markii` | MARK II-实验 | `main/exp1/MARKII` | `src/pages/exp1/markii/index.tsx` | 是 | `A` |
| `cosmic` | COSMIC-实验 | `13_COSMIC_SoftwareScaleMeasurement`,`43_COSMIC` | `src/pages/exp1/cosmic/index.tsx` | 是 | `A` |
| `gb21` | 国标GB标准-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `leibi` | 类比法-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `leitui` | 类推法-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `minjie` | 敏捷方法-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `gb31` | 国标GB标准-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `gb41` | 国标GB标准-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `xinxihuapinggu` | 国标GB标准-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `tanpaifang61` | 碳排放权供给与需求-实验 | `29_mondaytravel`,`35_carbon`,`28-SoftwareTestingCostEstimation` | `src/pages/exp6/tanpaifang/index.tsx` | 是（`tanpaifang`） | `A` |
| `jinxianzhi` | 净现值NPV和内部收益率IRR计算-实验 | `20_IRR&NPV`,`28-SoftwareTestingCostEstimation` | `src/pages/exp7/jinxianzhi/index.tsx` | 是 | `A` |
| `dongtaitouzi` | 动态投资回收期计算-实验 | `main/exp7/DONGTAITOUZI` | `src/pages/exp7/dongtaitouzi/index.tsx` | 否 | `B` |
| `shengmingzhouqi` | 软件经济生命周期计算-实验 | `28-SoftwareTestingCostEstimation` | `src/pages/exp7/shengmingzhouqi/index.tsx` | 否 | `B` |
| `chongzhiqi` | 软件重置期计算-实验 | `28-SoftwareTestingCostEstimation` | `src/pages/exp7/chongzhiqi/index.tsx` | 否 | `B` |
| `tuiyi` | 软件退役计算-实验 | `main` | - | 否 | `C` |
| `yinkuipingheng` | 盈亏平衡-实验 | `16_yinkuipingheng`,`3_BreakEvenPoint`,`28-SoftwareTestingCostEstimation` | `src/pages/exp7/yinkuipingheng/index.tsx` | 是 | `A` |
| `qiwangjingxianzhi` | 期望净现值法-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `minganxing` | 敏感性分析-实验 | `19_SensitivityAnalysisMethod`,`48_LoveMeIfBug`,`28-SoftwareTestingCostEstimation` | `src/pages/exp8/minganxing/index.tsx` | 是 | `A` |
| `jueceshu` | 决策树法-实验 | `28-SoftwareTestingCostEstimation` | `src/pages/exp10/decisiontree/index.tsx` | 是（`decisiontree`） | `A` |
| `mengtekaluo` | 蒙特卡洛法-实验 | `28-SoftwareTestingCostEstimation` | `src/pages/exp47/montecarlo/index.tsx` | 否 | `B` |
| `boyi` | 博弈-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `buqueding` | 不确定性分析-实验 | `36_UncertaintyEstimation` | `src/pages/exp9/buqueding/index.tsx` | 是 | `A` |
| `jianhuajisuan` | 简化计算模型-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `yingli` | 盈利能力分析-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `changzhai` | 偿债能力分析-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `shengcun` | 生存能力分析-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `fenxiyupingjia` | 经济分析与评价-实验 | `111_DanFangAn`,`28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `xiaoyi` | 费用-效益分析与评价-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `xiaoguo` | 费用-效果分析与评价-实验 | `28-SoftwareTestingCostEstimation` | - | 否 | `C` |
| `eva` | 软件项目监督与控制-EVA法-实验 | `main/exp14/EVA` | - | 否 | `C` |

## 3) 迁移缺口统计
- `A-已迁移可用`：10 项
- `B-已实现待上架`：4 项（`dongtaitouzi`,`chongzhiqi`,`shengmingzhouqi`,`mengtekaluo`）
- `C-未迁移`：19 项

## 4) 子agent可执行分配清单（直接可编排）
| 批次 | 任务 | 目标实验 | 建议子agent | 关键落地文件 |
|---|---|---|---|---|
| Wave-P0 | 先上架现有代码 | `dongtaitouzi`,`chongzhiqi`,`shengmingzhouqi`,`montecarlo` | Infra-Agent | `src/db/index.ts`、`src/pages/experiment/index.tsx`、DB 迁移脚本 |
| Wave-P1 | 规模度量扩展 | `gb11`,`ifpug`,`nesma` | FP-Agent | `src/pages/exp1/*` |
| Wave-P1 | 开发成本估算 | `gb21`,`leibi`,`leitui`,`minjie` | DevCost-Agent | `src/pages/exp2/*` |
| Wave-P1 | 成本国标扩展 | `gb31`,`gb41`,`xinxihuapinggu` | StdCost-Agent | `src/pages/exp3/*`,`src/pages/exp4/*`,`src/pages/exp5/*` |
| Wave-P1 | 投资评价补足 | `tuiyi` | Investment-Agent | `src/pages/exp7/tuiyi/index.tsx` |
| Wave-P1 | 风险分析扩展 | `qiwangjingxianzhi`,`boyi` | Risk-Agent | `src/pages/exp8/*` |
| Wave-P1 | 财务分析扩展 | `jianhuajisuan`,`yingli`,`changzhai`,`shengcun`,`fenxiyupingjia` | Finance-Agent | `src/pages/exp10/*`,`src/pages/exp11/*` |
| Wave-P1 | 费用评估扩展 | `xiaoyi`,`xiaoguo` | Benefit-Agent | `src/pages/exp12/*`,`src/pages/exp13/*` |
| Wave-P1 | EVA扩展 | `eva` | EVA-Agent | `src/pages/exp14/eva/index.tsx` |
| Wave-P2 | 集成收口 | 全部新增实验 | Infra-Agent + QA-Agent | `src/db/index.ts`、菜单接口、回归测试 |

## 5) 当前最关键阻断（建议优先修）
- `experiment.db` 已存在时，`src/db/index.ts` 的新增种子仍在 `if (userCount.count === 0)` 内，导致“已实现待上架”的实验不会自动出现在侧栏。
- 建议新增“幂等迁移”逻辑（`INSERT OR IGNORE` + 启动时执行），而不是仅依赖首次建库引导。
