/**
 * 计算引擎导出
 */

// 财务计算
export { npv, irr, dpp, isFeasible, calculateScore, TEST_CASHFLOWS, TEST_RATE, EXPECTED_NPV } from "./financial";

// 盈亏平衡
export { breakeven, getBreakevenStatus, targetSales, TEST_BREAKEVEN_INPUT } from "./breakeven";
export type { BreakevenInput, BreakevenResult } from "./breakeven";

// 敏感性分析
export { sensitivityAnalysis, sensitivityCoefficient, sortBySensitivity } from "./sensitivity";
export type { SensitivityFactor, SensitivityResult } from "./sensitivity";

// 不确定性决策
export { maxMin, maxMax, hurwicz, laplace, minMaxRegret, comprehensiveDecision } from "./decision";
export type { DecisionMethod, DecisionInput, DecisionResult } from "./decision";

// 决策树
export { calculateDecisionTree } from "./decisiontree";
export type { DecisionNode, DecisionTreeResult } from "./decisiontree";

// COSMIC
export { cosmic } from "./cosmic";
export type { CosmicEntry, CosmicResult } from "./cosmic";

// 蒙特卡洛
export { monteCarlo } from "./montecarlo";
export type { MonteCarloInput, MonteCarloResult } from "./montecarlo";

// 碳排放拍卖
export { carbonAuction } from "./carbon";
export type { CarbonExperiment, CarbonResult } from "./carbon";

// MARK II
export { markii } from "./markii";
export type { MarkIIEntity, MarkIIResult } from "./markii";
