# 分支来源映射（Branch -> Task）

## 使用原则
- 优先使用对目标实验有直接改动的分支作为主参考。
- 若分支仅含合并或无页面改动，以 `main` 的实验目录为准。
- 同一实验多个分支时，优先“功能完整度高”的分支，再参考后续样式修订分支。

## 映射表
| 任务ID | 主参考分支 | 次参考分支 | 关键源目录 |
|---|---|---|---|
| EXP-01 | `28-SoftwareTestingCostEstimation` | `47_MonteCarloMethod`（名称参考） | `front/src/pages/exp0/TEST1`、`front/src/pages/exp8/MENGTEKALUO` |
| EXP-02 | `28-SoftwareTestingCostEstimation` | `13_COSMIC_SoftwareScaleMeasurement`、`43_COSMIC` | `front/src/pages/exp1/GB11`、`IFPUG`、`NESMA`、`COSMIC` |
| EXP-03 | `28-SoftwareTestingCostEstimation` | 无 | `front/src/pages/exp2/CHENGBENGUSUAN`、`GB21`、`LEIBI`、`LEITUI`、`MINJIE` |
| EXP-04 | `28-SoftwareTestingCostEstimation` | 无 | `front/src/pages/exp3/GB31`、`exp4/GB41`、`exp5/GB51` |
| EXP-05 | `28-SoftwareTestingCostEstimation` | `20_IRR&NPV`、`3_BreakEvenPoint` | `front/src/pages/exp7/DONGTAITOUZI`、`CHONGZHIQI`、`SHENGMINGZHOUQI` |
| EXP-06 | `28-SoftwareTestingCostEstimation` | `19_SensitivityAnalysisMethod`、`16_yinkuipingheng` | `front/src/pages/exp8/QIWANGJINGXIANZHI`、`BOYI` |
| EXP-07 | `28-SoftwareTestingCostEstimation` | `111_DanFangAn` | `front/src/pages/exp10/JIANHUAJISUAN`、`YINGLI`、`CHANGZHAI`、`SHENGCUN`、`exp11/FENXIYUPINGJIA` |
| EXP-08 | `28-SoftwareTestingCostEstimation` | 无 | `front/src/pages/exp12/XIAOYI`、`exp13/XIAOGUO` |
| EXP-09 | `main`（目录基线） | `21_EVA`（命名参考） | `front/src/pages/exp14/EVA` |
| INF-04 | `wwj`（logo相关提交） | `main` | `front/src/assets/TJlogo.svg` 及实验相关静态资源 |

## 备注
- 以下分支与页面迁移关联弱（或无页面改动），可仅作历史参考：
  - `10_LLYZ`、`18_MARK_II`、`22_economic_life`、`26_DPP`、`32_decision_tree`、`33_unclecherry`、`39_123`、`40_caiwupingjia`、`44_COSMIC`、`8_costEstimation`、`9_CBZGtestcost`、`YangH`、`dev_Stepin`、`vvvviolet_main`、`zsp`。
