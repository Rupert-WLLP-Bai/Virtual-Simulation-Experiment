import { useState, useMemo } from "react";
import { npv, irr, dpp, isFeasible, calculateScore } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";

interface Result {
  npv: number;
  irr: number | null;
  dpp: number | null;
  feasible: boolean;
  score: number;
}

export default function SingleschemePage() {
  const [cashFlows, setCashFlows] = useState<number[]>([-100000, 30000, 40000, 50000, 20000]);
  const [rate, setRate] = useState<number>(10);

  const result: Result = useMemo(() => {
    const npvValue = npv(cashFlows, rate / 100);
    const irrValue = irr(cashFlows);
    const dppValue = dpp(cashFlows, rate / 100);
    const feasible = isFeasible(npvValue);
    const score = calculateScore(npvValue, irrValue, dppValue);
    return { npv: npvValue, irr: irrValue, dpp: dppValue, feasible, score };
  }, [cashFlows, rate]);

  const updateCashFlow = (index: number, value: number) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = value;
    setCashFlows(newCashFlows);
  };

  const addCashFlow = () => {
    setCashFlows([...cashFlows, 0]);
  };

  const removeCashFlow = (index: number) => {
    if (cashFlows.length > 2) {
      const newCashFlows = cashFlows.filter((_, i) => i !== index);
      setCashFlows(newCashFlows);
    }
  };

  const chartData = useMemo(() => {
    return cashFlows.map((cf, index) => {
      const cumulative = cashFlows.slice(0, index + 1).reduce((sum, c) => sum + c, 0);
      return { name: `第${index}期`, cashFlow: cf, cumulative };
    });
  }, [cashFlows]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">单方案财务评价</h1>
          <ExportPDF targetId="experiment-content" filename="单方案财务评价.pdf" />
        </div>

        {/* 输入参数 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">现金流配置</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">折现率 (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">期数</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">现金流（元）</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {cashFlows.map((cf, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-gray-800">{index === 0 ? "初始投资" : `第${index}期`}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={cf}
                        onChange={(e) => updateCashFlow(index, Number(e.target.value))}
                        className="w-full px-3 py-2 exp-input"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      {cashFlows.length > 2 && (
                        <button onClick={() => removeCashFlow(index)} className="text-red-600 hover:text-red-800">
                          删除
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={addCashFlow}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-800/80 transition-colors"
          >
            添加现金流
          </button>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatisticCard
            title="净现值 (NPV)"
            value={result.npv}
            prefix="¥"
            valueColor={result.feasible ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="内部收益率 (IRR)"
            value={result.irr !== null ? result.irr * 100 : 0}
            suffix="%"
            valueColor={result.irr !== null && result.irr > rate / 100 ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="动态回收期 (DPP)"
            value={result.dpp !== null ? result.dpp : 0}
            suffix="年"
            valueColor={result.dpp !== null && result.dpp < 5 ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="方案可行性"
            value={result.feasible ? 1 : 0}
            suffix={result.feasible ? "可行" : "不可行"}
            valueColor={result.feasible ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="综合评分"
            value={result.score}
            suffix="分"
            valueColor={result.score >= 60 ? "text-green-600" : "text-orange-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
        </div>

        {/* 图表 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">现金流分析图</h2>
          <LineChart
            title=""
            xAxisData={chartData.map((d) => d.name)}
            series={[
              { name: "现金流", data: chartData.map((d) => d.cashFlow), color: "#22c55e" },
              { name: "累计现金流", data: chartData.map((d) => d.cumulative), color: "#3b82f6" },
            ]}
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
