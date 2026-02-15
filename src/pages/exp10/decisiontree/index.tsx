import { useState, useMemo } from "react";
import { calculateDecisionTree, type DecisionNode, type DecisionTreeResult } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";

export default function DecisionTreePage() {
  const [discountRate, setDiscountRate] = useState<number>(10);

  // 简化的决策树结构
  const [decisionTree, setDecisionTree] = useState<DecisionNode>({
    id: "root",
    type: "decision",
    name: "投资决策",
    children: [
      {
        id: "d1",
        type: "chance",
        name: "市场需求高",
        probability: 0.4,
        children: [
          {
            id: "o1",
            type: "outcome",
            name: "高收益",
            value: 150000,
          },
        ],
      },
      {
        id: "d2",
        type: "chance",
        name: "市场需求中",
        probability: 0.4,
        children: [
          {
            id: "o2",
            type: "outcome",
            name: "中等收益",
            value: 80000,
          },
        ],
      },
      {
        id: "d3",
        type: "chance",
        name: "市场需求低",
        probability: 0.2,
        children: [
          {
            id: "o3",
            type: "outcome",
            name: "低收益",
            value: 20000,
          },
        ],
      },
    ],
  });

  const result: DecisionTreeResult = useMemo(
    () => calculateDecisionTree(decisionTree, discountRate / 100),
    [decisionTree, discountRate]
  );

  const updateOutcomeValue = (outcomeId: string, value: number) => {
    const updateNode = (node: DecisionNode): DecisionNode => {
      if (node.id === outcomeId && node.type === "outcome") {
        return { ...node, value };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };
    setDecisionTree(updateNode(decisionTree));
  };

  const updateProbability = (chanceId: string, probability: number) => {
    const updateNode = (node: DecisionNode): DecisionNode => {
      if (node.id === chanceId && node.type === "chance") {
        return { ...node, probability };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };
    setDecisionTree(updateNode(decisionTree));
  };

  // 提取所有机会节点和结果节点用于配置
  const extractNodes = (node: DecisionNode, nodes: { id: string; name: string; type: string; value?: number; probability?: number }[] = []) => {
    if (node.type === "chance") {
      nodes.push({ id: node.id, name: node.name, type: node.type, probability: node.probability });
    }
    if (node.type === "outcome") {
      nodes.push({ id: node.id, name: node.name, type: node.type, value: node.value });
    }
    node.children?.forEach((child) => extractNodes(child, nodes));
    return nodes;
  };

  const nodes = useMemo(() => extractNodes(decisionTree), [decisionTree]);

  const chartData = useMemo(() => {
    const data: { name: string; value: number }[] = [];
    const traverse = (node: DecisionNode) => {
      if (node.type === "chance" && node.probability !== undefined) {
        node.children?.forEach((child) => {
          if (child.type === "outcome" && child.value !== undefined) {
            data.push({
              name: node.name,
              value: child.value * node.probability,
            });
          }
        });
      }
      node.children?.forEach(traverse);
    };
    traverse(decisionTree);
    return data;
  }, [decisionTree]);

  return (
    <div className="min-h-screen bg-gray-50 p-6" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">决策树分析</h1>
          <ExportPDF targetId="experiment-content" filename="决策树分析.pdf" />
        </div>

        {/* 参数配置 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">参数设置</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">折现率 (%)</label>
              <input
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 节点配置 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">决策树节点配置</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">节点</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">类型</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">概率/收益</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => (
                <tr key={node.id} className="border-t">
                  <td className="px-4 py-2">{node.name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        node.type === "chance" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {node.type === "chance" ? "概率节点" : "结果节点"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {node.type === "chance" ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={node.probability || 0}
                        onChange={(e) => updateProbability(node.id, Number(e.target.value))}
                        className="w-24 px-3 py-2 border rounded-lg"
                      />
                    ) : (
                      <input
                        type="number"
                        value={node.value || 0}
                        onChange={(e) => updateOutcomeValue(node.id, Number(e.target.value))}
                        className="w-32 px-3 py-2 border rounded-lg"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <StatisticCard
            title="期望净现值 (ENPV)"
            value={result.enpv}
            prefix="¥"
            valueColor={result.enpv >= 0 ? "text-green-600" : "text-red-600"}
          />
          <StatisticCard
            title="风险概率"
            value={result.riskProbability}
            suffix="%"
            valueColor={result.riskProbability < 50 ? "text-green-600" : "text-red-600"}
          />
          <StatisticCard
            title="建议"
            value={result.recommendation === "可行" ? 1 : 0}
            suffix={result.recommendation}
            valueColor={result.recommendation === "可行" ? "text-green-600" : "text-red-600"}
          />
        </div>

        {/* 图表 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">各方案期望值</h2>
          <LineChart
            title=""
            xAxisData={chartData.map((d) => d.name)}
            series={[{ name: "期望值", data: chartData.map((d) => d.value), color: "#6366f1" }]}
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
