# 迁移缺口清单（Gap Inventory）

## 判定口径
- 已迁移：目标仓库存在可运行页面，且路由与菜单可到达。
- 部分迁移：存在页面但未接入菜单/数据，或仅占位实现。
- 未迁移：目标仓库不存在对应页面与计算逻辑。

## 总览
- 旧仓库实验目录基线：37 个实验子目录（`front/src/pages/exp*/...`）。
- 目标仓库当前实验种子：10 个（`src/db/index.ts`）。
- 目标仓库当前实验页面：11 个（含 `montecarlo` 页面）。

## 状态矩阵
| 旧实验目录 | 对应实验 | 当前状态 | 目标仓库现状 |
|---|---|---|---|
| exp1/COSMIC | COSMIC功能点 | 已迁移 | `src/pages/exp1/cosmic/index.tsx` |
| exp1/MARKII | MARK II功能点 | 已迁移 | `src/pages/exp1/markii/index.tsx` |
| exp5/Exp5_SINGLE_SCHEME | 单方案财务评价 | 已迁移 | `src/pages/exp1/singlescheme/index.tsx` |
| exp6/TANPAIFANG61 | 碳排放权交易 | 已迁移 | `src/pages/exp6/tanpaifang/index.tsx` |
| exp7/JINXIANZHI | NPV/IRR | 已迁移 | `src/pages/exp7/jinxianzhi/index.tsx` |
| exp8/YINKUIPINGHENG | 盈亏平衡 | 已迁移 | `src/pages/exp7/yinkuipingheng/index.tsx` |
| exp8/MINGANXING | 敏感性分析 | 已迁移 | `src/pages/exp8/minganxing/index.tsx` |
| exp9/BUQUEDING | 不确定性决策 | 已迁移 | `src/pages/exp9/buqueding/index.tsx` |
| exp8/JUECESHU | 决策树 | 已迁移 | `src/pages/exp10/decisiontree/index.tsx` |
| exp8/MENGTEKALUO | 蒙特卡洛 | 部分迁移 | 页面存在 `src/pages/exp47/montecarlo/index.tsx`，但未入实验种子菜单 |
| exp0/TEST1 | 测试成本估算 | 部分迁移 | `src/pages/exp4/testcost/index.tsx` 为占位页 |
| exp1/GB11 | 国标规模度量 | 未迁移 | 无对应页面 |
| exp1/GUOBIAO | 国标规模度量（另一实现） | 未迁移 | 无对应页面 |
| exp1/IFPUG | IFPUG方法 | 未迁移 | 无对应页面 |
| exp1/NESMA | NESMA方法 | 未迁移 | 无对应页面 |
| exp2/CHENGBENGUSUAN | 开发成本估算 | 未迁移 | 无对应页面 |
| exp2/GB21 | 开发成本国标 | 未迁移 | 无对应页面 |
| exp2/LEIBI | 类比法 | 未迁移 | 无对应页面 |
| exp2/LEITUI | 类推法 | 未迁移 | 无对应页面 |
| exp2/MINJIE | 敏捷估算法 | 未迁移 | 无对应页面 |
| exp3/GB31 | 测试成本国标 | 未迁移 | 无对应页面 |
| exp4/GB41 | 运维成本国标 | 未迁移 | 无对应页面 |
| exp5/GB51 | 绩效评价国标 | 未迁移 | 无对应页面 |
| exp7/DONGTAITOUZI | 动态投资回收期 | 未迁移 | 无对应页面 |
| exp7/CHONGZHIQI | 重置期 | 未迁移 | 无对应页面 |
| exp7/SHENGMINGZHOUQI | 生命周期 | 未迁移 | 无对应页面 |
| exp8/QIWANGJINGXIANZHI | 期望净现值法 | 未迁移 | 无对应页面 |
| exp8/BOYI | 博弈分析 | 未迁移 | 无对应页面 |
| exp10/JIANHUAJISUAN | 简化计算模型 | 未迁移 | 无对应页面 |
| exp10/YINGLI | 盈利能力分析 | 未迁移 | 无对应页面 |
| exp10/CHANGZHAI | 偿债能力分析 | 未迁移 | 无对应页面 |
| exp10/SHENGCUN | 生存能力分析 | 未迁移 | 无对应页面 |
| exp11/FENXIYUPINGJIA | 经济分析与评价 | 未迁移 | 无对应页面 |
| exp12/XIAOYI | 费用-效益分析 | 未迁移 | 无对应页面 |
| exp13/XIAOGUO | 费用-效果分析 | 未迁移 | 无对应页面 |
| exp14/EVA | EVA监督与控制 | 未迁移 | 无对应页面 |

## 现有高优先级缺口
- 菜单数据缺口：`montecarlo` 未挂到 `experiments` 种子和侧栏。
- 功能完整度缺口：`testcost` 仍为占位，需替换为完整实验。
- 资产缺口：旧仓库 `TJlogo.svg` 在新仓库缺失，首页logo需统一改为可打包资产。
