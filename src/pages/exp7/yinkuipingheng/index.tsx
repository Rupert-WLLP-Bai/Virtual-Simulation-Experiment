import { useState, useMemo } from "react";
import { breakeven, getBreakevenStatus, type BreakevenInput, type BreakevenResult } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";

export default function YinkuipinghengPage() {
  const [input, setInput] = useState<BreakevenInput>({
    fixedCost: 100000,
    variableCost: 30,
    unitPrice: 50,
    normalSales: 8000,
  });

  const result: BreakevenResult = useMemo(() => breakeven(input), [input]);
  const status = getBreakevenStatus(result);

  const chartData = useMemo(() => {
    const points = [];
    for (let q = 0; q <= input.normalSales * 1.5; q += 500) {
      const revenue = q * input.unitPrice;
      const totalCost = input.fixedCost + q * input.variableCost;
      points.push({ name: q.toString(), revenue, cost: totalCost });
    }
    return points;
  }, [input]);

  return (
    <div className="min-h-screen bg-gray-50 p-6" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">盈亏平衡分析</h1>
          <ExportPDF targetId="experiment-content" filename="盈亏平衡分析.pdf" />
        </div>

        {/* 输入参数 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">参数设置</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">固定成本</label>
              <input
                type="number"
                value={input.fixedCost}
                onChange={(e) => setInput({ ...input, fixedCost: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单位变动成本</label>
              <input
                type="number"
                value={input.variableCost}
                onChange={(e) => setInput({ ...input, variableCost: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单位售价</label>
              <input
                type="number"
                value={input.unitPrice}
                onChange={(e) => setInput({ ...input, unitPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">正常销售量</label>
              <input
                type="number"
                value={input.normalSales}
                onChange={(e) => setInput({ ...input, normalSales: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard
            title="盈亏平衡产量"
            value={result.breakevenQuantity}
            suffix="件"
            valueColor={status === "profit" ? "text-green-600" : "text-red-600"}
          />
          <StatisticCard
            title="盈亏平衡销售额"
            value={result.breakevenSales}
            prefix="¥"
            valueColor={status === "profit" ? "text-green-600" : "text-red-600"}
          />
          <StatisticCard
            title="安全边际"
            value={result.safetyMargin}
            suffix="件"
            trend={status === "profit" ? "up" : "down"}
            trendValue={`${result.safetyMarginRate}%`}
          />
          <StatisticCard
            title="边际贡献率"
            value={result.contributionMarginRate}
            suffix="%"
            valueColor="text-blue-600"
          />
        </div>

        {/* 图表 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">盈亏平衡图</h2>
          <LineChart
            title=""
            xAxisData={chartData.map((d) => d.name)}
            series={[
              { name: "销售收入", data: chartData.map((d) => d.revenue), color: "#22c55e" },
              { name: "总成本", data: chartData.map((d) => d.cost), color: "#ef4444" },
            ]}
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
