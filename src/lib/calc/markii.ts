/**
 * MARK II 功能点度量计算
 */

export interface MarkIIEntity {
  id: string;
  name: string;
  type: "ILF" | "EIF" | "EI" | "EO" | "EQ";
  complexity: "low" | "medium" | "high";
  ret: number; // 记录元素类型
  det: number; // 数据元素类型
}

const MARKII_WEIGHTS: Record<string, Record<string, number>> = {
  ILF: { low: 7, medium: 10, high: 15 },
  EIF: { low: 5, medium: 7, high: 10 },
  EI: { low: 3, medium: 4, high: 6 },
  EO: { low: 4, medium: 5, high: 7 },
  EQ: { low: 3, medium: 4, high: 6 },
};

export interface MarkIIResult {
  unadjustedFP: number;
  totalFP: number;
  details: { type: string; count: number; weight: number; fp: number }[];
}

/**
 * 计算 MARK II 功能点
 */
export function markii(entities: MarkIIEntity[]): MarkIIResult {
  const details: MarkIIResult["details"] = [];
  let unadjustedFP = 0;

  const grouped = entities.reduce((acc, e) => {
    const key = `${e.type}-${e.complexity}`;
    if (!acc[key]) acc[key] = { type: e.type, complexity: e.complexity, count: 0 };
    acc[key].count++;
    return acc;
  }, {} as Record<string, { type: string; complexity: string; count: number }>);

  Object.values(grouped).forEach((g) => {
    const weight = MARKII_WEIGHTS[g.type]?.[g.complexity] || 0;
    const fp = weight * g.count;
    unadjustedFP += fp;
    details.push({ type: g.type, count: g.count, weight, fp });
  });

  return {
    unadjustedFP,
    totalFP: unadjustedFP, // MARK II 不需要调整因子
    details,
  };
}
