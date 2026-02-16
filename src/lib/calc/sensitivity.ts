/**
 * 敏感性分析计算
 * 计算各因素变化对指标的影响程度
 */

export interface SensitivityFactor {
  name: string;
  baseValue: number;
  changes: number[]; // 变化百分比，如 -15, -10, -5, 0, 5, 10, 15
}

export interface SensitivityResult {
  factor: string;
  baseValue: number;
  coefficient: number; // 敏感性系数
  impactRange: { change: number; value: number }[];
}

/**
 * 计算敏感性系数
 * @param baseNPV 基准 NPV
 * @param factorChange 因素变化百分比
 * @param newNPV 变化后的 NPV
 * @returns 敏感性系数
 */
export function sensitivityCoefficient(baseNPV: number, factorChange: number, newNPV: number): number {
  if (baseNPV === 0 || factorChange === 0) return 0;
  const npvChange = (newNPV - baseNPV) / Math.abs(baseNPV);
  return npvChange / (factorChange / 100);
}

/**
 * 计算敏感性分析结果
 * @param factors 敏感性因素
 * @param calcFunc 计算函数，传入因素值返回指标值
 * @returns 各因素敏感性结果
 */
export function sensitivityAnalysis(
  factors: SensitivityFactor[],
  calcFunc: (values: Record<string, number>) => number
): SensitivityResult[] {
  const baseValues: Record<string, number> = {};
  factors.forEach((f) => (baseValues[f.name] = f.baseValue));

  const baseNPV = calcFunc(baseValues);

  return factors.map((factor) => {
    const impactRange = factor.changes.map((change) => {
      const newValues = { ...baseValues };
      newValues[factor.name] = factor.baseValue * (1 + change / 100);
      const newNPV = calcFunc(newValues);
      return { change, value: newNPV };
    });

    // 选择最大正变化和最大负变化计算系数
    const maxPositive = impactRange.filter((r) => r.change > 0).reduce((a, b) => (Math.abs(a.value - baseNPV) > Math.abs(b.value - baseNPV) ? a : b), impactRange[0]!);
    const maxNegative = impactRange.filter((r) => r.change < 0).reduce((a, b) => (Math.abs(a.value - baseNPV) > Math.abs(b.value - baseNPV) ? a : b), impactRange[0]!);

    const coefPositive = sensitivityCoefficient(baseNPV, maxPositive.change, maxPositive.value);
    const coefNegative = sensitivityCoefficient(baseNPV, maxNegative.change, maxNegative.value);

    return {
      factor: factor.name,
      baseValue: factor.baseValue,
      coefficient: Math.max(Math.abs(coefPositive), Math.abs(coefNegative)),
      impactRange,
    };
  });
}

/**
 * 按敏感性系数排序
 * @param results 敏感性结果
 * @returns 排序后的结果
 */
export function sortBySensitivity(results: SensitivityResult[]): SensitivityResult[] {
  return [...results].sort((a, b) => b.coefficient - a.coefficient);
}
