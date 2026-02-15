/**
 * 盈亏平衡分析计算
 * 计算保本点、安全边际等指标
 */

export interface BreakevenInput {
  /** 固定成本 */
  fixedCost: number;
  /** 单位变动成本 */
  variableCost: number;
  /** 单位售价 */
  unitPrice: number;
  /** 正常销售量 */
  normalSales: number;
}

export interface BreakevenResult {
  /** 盈亏平衡产量 */
  breakevenQuantity: number;
  /** 盈亏平衡销售额 */
  breakevenSales: number;
  /** 安全边际 */
  safetyMargin: number;
  /** 安全边际率 (%) */
  safetyMarginRate: number;
  /** 单位边际贡献 */
  unitContribution: number;
  /** 边际贡献率 (%) */
  contributionMarginRate: number;
}

/**
 * 计算盈亏平衡点
 * @param input 盈亏平衡输入参数
 * @returns 盈亏平衡结果
 */
export function breakeven(input: BreakevenInput): BreakevenResult {
  const { fixedCost, variableCost, unitPrice, normalSales } = input;

  // 单位边际贡献 = 销售单价 - 变动成本
  const unitContribution = unitPrice - variableCost;

  // 边际贡献率 = 边际贡献 / 销售单价
  const contributionMarginRate = unitPrice > 0 ? (unitContribution / unitPrice) * 100 : 0;

  // 盈亏平衡产量 = 固定成本 / 单位边际贡献
  const breakevenQuantity = unitContribution > 0 ? fixedCost / unitContribution : Infinity;

  // 盈亏平衡销售额 = 固定成本 / 边际贡献率
  const breakevenSales = contributionMarginRate > 0 ? fixedCost / (contributionMarginRate / 100) : Infinity;

  // 安全边际 = 正常销售量 - 盈亏平衡产量
  const safetyMargin = normalSales - breakevenQuantity;

  // 安全边际率 = 安全边际 / 正常销售量 * 100%
  const safetyMarginRate = normalSales > 0 ? (safetyMargin / normalSales) * 100 : 0;

  return {
    breakevenQuantity: Math.round(breakevenQuantity * 100) / 100,
    breakevenSales: Math.round(breakevenSales * 100) / 100,
    safetyMargin: Math.round(safetyMargin * 100) / 100,
    safetyMarginRate: Math.round(safetyMarginRate * 100) / 100,
    unitContribution: Math.round(unitContribution * 100) / 100,
    contributionMarginRate: Math.round(contributionMarginRate * 100) / 100,
  };
}

/**
 * 判断盈亏状态
 * @param result 盈亏平衡结果
 * @returns 状态: "profit"(盈利), "breakeven"(保本), "loss"(亏损)
 */
export function getBreakevenStatus(result: BreakevenResult): "profit" | "breakeven" | "loss" {
  if (result.safetyMarginRate > 0) return "profit";
  if (result.safetyMarginRate === 0) return "breakeven";
  return "loss";
}

/**
 * 计算目标利润下的销售量
 * @param input 盈亏平衡输入参数
 * @param targetProfit 目标利润
 * @returns 目标销售量
 */
export function targetSales(input: BreakevenInput, targetProfit: number): number {
  const { fixedCost, variableCost, unitPrice } = input;
  const unitContribution = unitPrice - variableCost;
  if (unitContribution <= 0) return Infinity;
  return (fixedCost + targetProfit) / unitContribution;
}

// 测试数据
export const TEST_BREAKEVEN_INPUT: BreakevenInput = {
  fixedCost: 100000,
  variableCost: 30,
  unitPrice: 50,
  normalSales: 8000,
};

export const TEST_BREAKEVEN_RESULT: BreakevenResult = {
  breakevenQuantity: 5000,
  breakevenSales: 250000,
  safetyMargin: 3000,
  safetyMarginRate: 37.5,
  unitContribution: 20,
  contributionMarginRate: 40,
};
