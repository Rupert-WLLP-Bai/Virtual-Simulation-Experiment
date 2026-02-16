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
  const normalizeProbabilities = (children: DecisionNode[]): number[] => {
    if (children.length === 0) return [];

    const specified = children.map((child) =>
      typeof child.probability === "number" && child.probability >= 0 ? child.probability : null
    );
    const specifiedSum = specified.reduce((sum, p) => sum + (p ?? 0), 0);
    const unspecifiedCount = specified.filter((p) => p === null).length;

    let probs: number[] = [];
    if (unspecifiedCount === 0) {
      probs = children.map((_, idx) => specified[idx] ?? 0);
    } else {
      const remaining = Math.max(0, 1 - specifiedSum);
      const fallback = remaining / unspecifiedCount;
      probs = children.map((_, idx) => specified[idx] ?? fallback);
    }

    const total = probs.reduce((sum, p) => sum + p, 0);
    if (total <= 0) {
      const equal = 1 / children.length;
      return children.map(() => equal);
    }
    return probs.map((p) => p / total);
  };

  function traverse(node: DecisionNode, depth = 0): { value: number; riskProb: number } {
    if (node.type === "outcome") {
      const discounted = (node.value || 0) / Math.pow(1 + discountRate, depth);
      return { value: discounted, riskProb: discounted < 0 ? 1 : 0 };
    }

    if (node.type === "chance") {
      const children = node.children ?? [];
      if (children.length === 0) {
        return { value: 0, riskProb: 0 };
      }

      const probabilities = normalizeProbabilities(children);
      let totalValue = 0;
      let totalRiskProb = 0;
      children.forEach((child, idx) => {
        const prob = probabilities[idx]!;
        const result = traverse(child, depth + 1);
        totalValue += result.value * prob;
        totalRiskProb += result.riskProb * prob;
      });
      return { value: totalValue, riskProb: totalRiskProb };
    }

    if (node.type === "decision") {
      const children = node.children ?? [];
      if (children.length === 0) {
        return { value: 0, riskProb: 0 };
      }

      // 当子节点都配置了概率时，按机会节点聚合（适配“单方案多情景”教学模型）
      const allChildrenHaveProbability = children.every(
        (child) => typeof child.probability === "number" && child.probability >= 0
      );
      if (allChildrenHaveProbability) {
        const probabilities = normalizeProbabilities(children);
        let totalValue = 0;
        let totalRiskProb = 0;
        children.forEach((child, idx) => {
          const result = traverse(child, depth + 1);
          const prob = probabilities[idx]!;
          totalValue += result.value * prob;
          totalRiskProb += result.riskProb * prob;
        });
        return { value: totalValue, riskProb: totalRiskProb };
      }

      let bestValue = -Infinity;
      let bestRiskProb = 0;
      children.forEach((child) => {
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
