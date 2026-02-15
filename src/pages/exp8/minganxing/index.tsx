import { useState, useMemo } from "react";
import { sensitivityAnalysis, sortBySensitivity, type SensitivityFactor, type SensitivityResult } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";

export default function MinganxingPage() {
  const [factors, setFactors] = useState<SensitivityFactor[]>([
    { name: "投资额", baseValue: 100000, changes: [-20, -10, 0, 10, 20] },
    { name: "年收入", baseValue: 30000, changes: [-20, -10, 0, 10, 20] },
    { name: "年运营成本", baseValue: 10000, changes: [-20, -10, 0, 10, 20] },
    { name: "折现率", baseValue: 10, changes: [-20, -10, 0, 10, 20] },
  ]);

  const [rate, setRate] = useState<number>(10);

  // NPV 计算函数
  const calcNPV = (values: Record<string, number>): number => {
    const investment = values["投资额"];
    const annualIncome = values["年收入"];
    const annualCost = values["年运营成本"];
    const discountRate = values["折现率"] / 100;

    const cashFlows = [-investment];
    for (let i = 0; i < 5; i++) {
      cashFlows.push(annualIncome - annualCost);
    }

    return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + discountRate, t), 0);
  };

  const results: SensitivityResult[] = useMemo(() => {
    const analysisResults = sensitivityAnalysis(factors, calcNPV);
    return sortBySensitivity(analysisResults);
  }, [factors, rate]);

  const baseNPV = useMemo(() => {
    const baseValues: Record<string, number> = {};
    factors.forEach((f) => (baseValues[f.name] = f.baseValue));
    return calcNPV(baseValues);
  }, [factors, rate]);

  const updateFactor = (index: number, updates: Partial<SensitivityFactor>) => {
    const newFactors = [...factors];
    newFactors[index] = { ...newFactors[index], ...updates };
    setFactors(newFactors);
  };

  const chartData = useMemo(() => {
    if (results.length === 0) return [];
    return results[0].impactRange.map((r) => ({
      name: `${r.change > 0 ? "+" : ""}${r.change}%`,
      value: r.value,
    }));
  }, [results]);

  return (
    <div className="min-h-screen bg-gray-50 p-6" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">敏感性分析</h1>
          <ExportPDF targetId="experiment-content" filename="敏感性分析.pdf" />
        </div>

        {/* 输入参数 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">敏感性因素配置</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">折现率 (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">因素名称</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">基准值</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">变化范围 (%)</th>
              </tr>
            </thead>
            <tbody>
              {factors.map((factor, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={factor.name}
                      onChange={(e) => updateFactor(index, { name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={factor.baseValue}
                      onChange={(e) => updateFactor(index, { baseValue: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={factor.changes.join(", ")}
                      onChange={(e) => {
                        const changes = e.target.value.split(",").map((s) => Number(s.trim()));
                        if (!changes.some(isNaN)) {
                          updateFactor(index, { changes });
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard
            title="基准 NPV"
            value={baseNPV}
            prefix="¥"
            valueColor={baseNPV >= 0 ? "text-green-600" : "text-red-600"}
          />
          {results.slice(0, 3).map((result, index) => (
            <StatisticCard
              key={index}
              title={`${result.factor} 敏感性系数`}
              value={result.coefficient}
              valueColor="text-blue-600"
            />
          ))}
        </div>

        {/* 敏感性分析详情 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">敏感性排序</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">排名</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">因素</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">基准值</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">敏感性系数</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">敏感程度</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{result.factor}</td>
                  <td className="px-4 py-2">{result.baseValue}</td>
                  <td className="px-4 py-2">{result.coefficient.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        result.coefficient > 1
                          ? "bg-red-100 text-red-800"
                          : result.coefficient > 0.5
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {result.coefficient > 1 ? "高敏感" : result.coefficient > 0.5 ? "中敏感" : "低敏感"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 图表 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">敏感性分析图（最敏感因素）</h2>
          {results.length > 0 && (
            <LineChart
              title=""
              xAxisData={chartData.map((d) => d.name)}
              series={[{ name: "NPV", data: chartData.map((d) => d.value), color: "#6366f1" }]}
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
}
