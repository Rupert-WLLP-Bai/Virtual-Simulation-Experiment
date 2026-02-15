/**
 * 决策树分析计算
 */

export interface DecisionNode {
  id: string;
  type: "decision" | "chance" | "outcome";
  name: string;
  value?: number;
  probability?: number;
  children?: DecisionNode[];
}

export interface DecisionTreeResult {
  enpv: number; // 期望净现值
  riskProbability: number; // 风险概率 (NPV < 0 的概率)
  recommendation: string;
}

/**
 * 计算决策树期望值
 */
export function calculateDecisionTree(root: DecisionNode, discountRate = 0.1): DecisionTreeResult {
  function traverse(node: DecisionNode, depth = 0): { value: number; riskProb: number } {
    if (node.type === "outcome") {
      const years = node.children?.length || 1;
      const discounted = (node.value || 0) / Math.pow(1 + discountRate, depth * years);
      return { value: discounted, riskProb: node.value! < 0 ? 1 : 0 };
    }

    if (node.type === "chance") {
      let totalValue = 0;
      let totalRiskProb = 0;
      node.children?.forEach((child) => {
        const prob = child.probability || 1 / (node.children?.length || 1);
        const result = traverse(child, depth + 1);
        totalValue += result.value * prob;
        totalRiskProb += result.riskProb * prob;
      });
      return { value: totalValue, riskProb: totalRiskProb };
    }

    if (node.type === "decision") {
      let bestValue = -Infinity;
      let bestRiskProb = 0;
      node.children?.forEach((child) => {
        const result = traverse(child, depth + 1);
        if (result.value > bestValue) {
          bestValue = result.value;
          bestRiskProb = result.riskProb;
        }
      });
      return { value: bestValue, riskProb: bestRiskProb };
    }

    return { value: 0, riskProb: 0 };
  }

  const result = traverse(root);
  return {
    enpv: Math.round(result.value * 100) / 100,
    riskProbability: Math.round(result.riskProb * 10000) / 100,
    recommendation: result.value > 0 ? "可行" : "不可行",
  };
}
