/**
 * 财务计算引擎
 * 包含 NPV、IRR、DPP 等投资评价指标计算
 */

/**
 * 计算净现值 (Net Present Value)
 * @param cashFlows 现金流数组 (第一期为初始投资，应为负数)
 * @param rate 折现率 (如 0.1 表示 10%)
 * @returns 净现值
 */
export function npv(cashFlows: number[], rate: number): number {
  if (cashFlows.length === 0) return 0;
  if (rate <= -1) return Infinity;

  return cashFlows.reduce((sum, cf, t) => {
    return sum + cf / Math.pow(1 + rate, t);
  }, 0);
}

/**
 * 计算内部收益率 (Internal Rate of Return)
 * 使用二分法求解
 * @param cashFlows 现金流数组
 * @param maxIterations 最大迭代次数
 * @param tolerance 收敛精度
 * @returns 内部收益率，如果无法计算返回 null
 */
export function irr(
  cashFlows: number[],
  maxIterations = 100,
  tolerance = 0.0001
): number | null {
  if (cashFlows.length < 2) return null;

  // 检查是否有正负现金流交替
  let hasPositive = false;
  let hasNegative = false;
  for (const cf of cashFlows) {
    if (cf > 0) hasPositive = true;
    if (cf < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) return null;

  // 二分法求解
  let low = -0.99;
  let high = 10; // 1000%

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const npvMid = npv(cashFlows, mid);

    if (Math.abs(npvMid) < tolerance) {
      return mid;
    }

    if (npv(cashFlows, low) * npvMid < 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * 计算动态回收期 (Dynamic Payback Period)
 * @param cashFlows 现金流数组
 * @param rate 折现率
 * @returns 回收期（年），如果无法回收返回 null
 */
export function dpp(cashFlows: number[], rate: number): number | null {
  if (cashFlows.length === 0) return null;

  let cumulative = 0;
  const discountedFlows = cashFlows.map((cf, t) => ({
    cf,
    discounted: cf / Math.pow(1 + rate, t),
  }));

  for (let i = 0; i < discountedFlows.length; i++) {
    const current = discountedFlows[i]!;
    cumulative += current.discounted;
    if (cumulative >= 0) {
      // 线性插值计算精确回收期
      if (i === 0) return 0;
      const prevCumulative = cumulative - current.discounted;
      const fraction = Math.abs(prevCumulative) / current.discounted;
      return i - 1 + fraction;
    }
  }

  return null; // 无法回收
}

/**
 * 判断投资方案是否可行
 * @param npv 净现值
 * @returns 是否可行
 */
export function isFeasible(npv: number): boolean {
  return npv > 0;
}

/**
 * 计算投资方案的评分
 * @param npv 净现值
 * @param irr 内部收益率
 * @param dpp 动态回收期
 * @param minIRR 最低要求收益率
 * @returns 评分 (0-100)
 */
export function calculateScore(
  npv: number,
  irr: number | null,
  dpp: number | null,
  minIRR: number = 0.1
): number {
  let score = 0;

  // NPV 评分 (最高 40 分)
  if (npv > 0) score += 20;
  if (npv > 10000) score += 10;
  if (npv > 50000) score += 10;

  // IRR 评分 (最高 40 分)
  if (irr !== null) {
    if (irr > minIRR) score += 20;
    if (irr > minIRR * 1.5) score += 10;
    if (irr > minIRR * 2) score += 10;
  }

  // DPP 评分 (最高 20 分)
  if (dpp !== null) {
    if (dpp < 5) score += 10;
    if (dpp < 3) score += 10;
  }

  return score;
}

// 测试数据
export const TEST_CASHFLOWS = [-10000, 3000, 4000, 5000, 2000];
export const TEST_RATE = 0.1;
export const EXPECTED_NPV = 2670.28; // 已知正确值约 2670
