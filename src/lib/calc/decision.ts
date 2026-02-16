/**
 * 不确定性决策计算
 * 5种决策方法: Max-Min, Max-Max, Hurwicz, Laplace, Min-Max Regret
 */

export type DecisionMethod = "maxmin" | "maxmax" | "hurwicz" | "laplace" | "minmaxregret";

export interface DecisionInput {
  alternatives: string[]; // 方案名称
  states: string[]; // 状态名称
  payoffMatrix: number[][]; // 收益矩阵 [方案][状态]
}

export interface DecisionResult {
  method: DecisionMethod;
  selected: string;
  value: number;
  details?: Record<string, number>;
}

/**
 * 最大最小法 (Wald)
 * 选择最坏情况下的最好方案
 */
export function maxMin(input: DecisionInput): DecisionResult {
  const minValues = input.payoffMatrix.map((row) => Math.min(...row));
  const selectedIndex = minValues.indexOf(Math.max(...minValues));
  return {
    method: "maxmin",
    selected: input.alternatives[selectedIndex],
    value: minValues[selectedIndex],
    details: Object.fromEntries(input.alternatives.map((a, i) => [a, minValues[i]])),
  };
}

/**
 * 最大最大法 (Optimistic)
 * 选择最好情况下的最好方案
 */
export function maxMax(input: DecisionInput): DecisionResult {
  const maxValues = input.payoffMatrix.map((row) => Math.max(...row));
  const selectedIndex = maxValues.indexOf(Math.max(...maxValues));
  return {
    method: "maxmax",
    selected: input.alternatives[selectedIndex],
    value: maxValues[selectedIndex],
    details: Object.fromEntries(input.alternatives.map((a, i) => [a, maxValues[i]])),
  };
}

/**
 * 赫威兹法 (Hurwicz)
 * 加权平均最好和最坏情况
 * @param alpha 乐观系数 (0-1)，0 为完全悲观，1 为完全乐观
 */
export function hurwicz(input: DecisionInput, alpha = 0.5): DecisionResult {
  const values = input.payoffMatrix.map((row) => {
    const min = Math.min(...row);
    const max = Math.max(...row);
    return alpha * max + (1 - alpha) * min;
  });
  const selectedIndex = values.indexOf(Math.max(...values));
  return {
    method: "hurwicz",
    selected: input.alternatives[selectedIndex],
    value: values[selectedIndex],
    details: Object.fromEntries(input.alternatives.map((a, i) => [a, values[i]])),
  };
}

/**
 * 拉普拉斯法 (Equal Probability)
 * 假设所有状态概率相等
 */
export function laplace(input: DecisionInput): DecisionResult {
  const avgValues = input.payoffMatrix.map((row) => row.reduce((a, b) => a + b, 0) / row.length);
  const selectedIndex = avgValues.indexOf(Math.max(...avgValues));
  return {
    method: "laplace",
    selected: input.alternatives[selectedIndex],
    value: avgValues[selectedIndex],
    details: Object.fromEntries(input.alternatives.map((a, i) => [a, avgValues[i]])),
  };
}

/**
 * 最小最大遗憾法 (Min-Max Regret)
 * 最小化最大机会损失
 */
export function minMaxRegret(input: DecisionInput): DecisionResult {
  // 计算每列的最大值
  const colMax = input.states.map((_, j) => Math.max(...input.payoffMatrix.map((row) => row[j])));

  // 计算遗憾矩阵
  const regretMatrix = input.payoffMatrix.map((row) => row.map((v, j) => colMax[j] - v));

  // 找每行的最大遗憾
  const maxRegrets = regretMatrix.map((row) => Math.max(...row));
  const selectedIndex = maxRegrets.indexOf(Math.min(...maxRegrets));

  return {
    method: "minmaxregret",
    selected: input.alternatives[selectedIndex],
    value: -maxRegrets[selectedIndex], // 返回负的遗憾值便于比较
    details: Object.fromEntries(input.alternatives.map((a, i) => [a, maxRegrets[i]])),
  };
}

/**
 * 综合决策 - 使用所有方法
 */
export function comprehensiveDecision(input: DecisionInput, hurwiczAlpha = 0.5): DecisionResult[] {
  return [maxMin(input), maxMax(input), hurwicz(input, hurwiczAlpha), laplace(input), minMaxRegret(input)];
}
