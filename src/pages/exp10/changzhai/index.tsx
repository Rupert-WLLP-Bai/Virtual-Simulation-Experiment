import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

type Level = "good" | "warning" | "risk";

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

function levelText(level: Level): string {
  if (level === "good") return "良好";
  if (level === "warning") return "关注";
  return "风险";
}

function levelClass(level: Level): string {
  if (level === "good") return "text-green-600";
  if (level === "warning") return "text-amber-600";
  return "text-red-600";
}

export default function ChangzhaiPage() {
  const [currentAssets, setCurrentAssets] = useState(320000);
  const [inventory, setInventory] = useState(70000);
  const [currentLiabilities, setCurrentLiabilities] = useState(160000);
  const [totalLiabilities, setTotalLiabilities] = useState(420000);
  const [totalAssets, setTotalAssets] = useState(780000);
  const [ebit, setEbit] = useState(180000);
  const [interestExpense, setInterestExpense] = useState(60000);
  const [operatingCashFlow, setOperatingCashFlow] = useState(210000);
  const [annualDebtService, setAnnualDebtService] = useState(150000);

  const currentRatio = useMemo(
    () => safeDivide(currentAssets, currentLiabilities),
    [currentAssets, currentLiabilities]
  );
  const quickRatio = useMemo(
    () => safeDivide(currentAssets - inventory, currentLiabilities),
    [currentAssets, inventory, currentLiabilities]
  );
  const debtAssetRatio = useMemo(
    () => safeDivide(totalLiabilities, totalAssets),
    [totalLiabilities, totalAssets]
  );
  const interestCoverage = useMemo(
    () => safeDivide(ebit, interestExpense),
    [ebit, interestExpense]
  );
  const dscr = useMemo(
    () => safeDivide(operatingCashFlow, annualDebtService),
    [operatingCashFlow, annualDebtService]
  );

  const items = useMemo(
    () => [
      {
        metric: "流动比率",
        formula: "流动资产 / 流动负债",
        value: currentRatio,
        standard: ">= 2.0",
        level: (currentRatio >= 2 ? "good" : currentRatio >= 1 ? "warning" : "risk") as Level,
      },
      {
        metric: "速动比率",
        formula: "(流动资产 - 存货) / 流动负债",
        value: quickRatio,
        standard: ">= 1.0",
        level: (quickRatio >= 1 ? "good" : quickRatio >= 0.7 ? "warning" : "risk") as Level,
      },
      {
        metric: "资产负债率",
        formula: "负债总额 / 资产总额",
        value: debtAssetRatio,
        standard: "<= 60%",
        level: (debtAssetRatio <= 0.6 ? "good" : debtAssetRatio <= 0.75 ? "warning" : "risk") as Level,
      },
      {
        metric: "利息保障倍数",
        formula: "EBIT / 利息费用",
        value: interestCoverage,
        standard: ">= 2.0",
        level: (interestCoverage >= 2 ? "good" : interestCoverage >= 1.2 ? "warning" : "risk") as Level,
      },
      {
        metric: "债务偿付覆盖率 DSCR",
        formula: "经营现金流 / 年度本息支出",
        value: dscr,
        standard: ">= 1.2",
        level: (dscr >= 1.2 ? "good" : dscr >= 1 ? "warning" : "risk") as Level,
      },
    ],
    [currentRatio, quickRatio, debtAssetRatio, interestCoverage, dscr]
  );

  const riskCount = useMemo(
    () => items.filter((item) => item.level === "risk").length,
    [items]
  );

  const warningCount = useMemo(
    () => items.filter((item) => item.level === "warning").length,
    [items]
  );

  const overallConclusion = useMemo(() => {
    if (riskCount > 0) return "偿债风险较高，建议优化负债结构与现金流。";
    if (warningCount > 0) return "偿债能力总体可控，但部分指标需持续跟踪。";
    return "偿债能力表现良好。";
  }, [riskCount, warningCount]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">偿债能力分析</h1>
          <ExportPDF targetId="experiment-content" filename="偿债能力分析.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "流动比率", formula: String.raw`Current\ Ratio=\frac{Current\ Assets}{Current\ Liabilities}` },
              { label: "速动比率", formula: String.raw`Quick\ Ratio=\frac{Current\ Assets-Inventory}{Current\ Liabilities}` },
              { label: "利息保障倍数", formula: String.raw`Interest\ Coverage=\frac{EBIT}{Interest}` },
              { label: "DSCR", formula: String.raw`DSCR=\frac{Operating\ Cash\ Flow}{Debt\ Service}` },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">参数输入</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">流动资产（元）</label>
              <input type="number" value={currentAssets} onChange={(e) => setCurrentAssets(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">存货（元）</label>
              <input type="number" value={inventory} onChange={(e) => setInventory(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">流动负债（元）</label>
              <input type="number" value={currentLiabilities} onChange={(e) => setCurrentLiabilities(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">负债总额（元）</label>
              <input type="number" value={totalLiabilities} onChange={(e) => setTotalLiabilities(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">资产总额（元）</label>
              <input type="number" value={totalAssets} onChange={(e) => setTotalAssets(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">息税前利润 EBIT（元）</label>
              <input type="number" value={ebit} onChange={(e) => setEbit(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">利息费用（元）</label>
              <input type="number" value={interestExpense} onChange={(e) => setInterestExpense(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">经营现金流（元）</label>
              <input type="number" value={operatingCashFlow} onChange={(e) => setOperatingCashFlow(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">年度本息支出（元）</label>
              <input type="number" value={annualDebtService} onChange={(e) => setAnnualDebtService(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="流动比率" value={currentRatio.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="速动比率" value={quickRatio.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="资产负债率" value={`${(debtAssetRatio * 100).toFixed(2)}%`} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="利息保障倍数" value={interestCoverage.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatisticCard title="债务偿付覆盖率 DSCR" value={dscr.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="综合结论" value={overallConclusion} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">指标诊断表</h2>
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">指标</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">计算公式</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">计算值</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">参考标准</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">评估</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.metric} className="border-t border-gray-200">
                  <td className="px-3 py-2 text-sm text-gray-800">{item.metric}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{item.formula}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">
                    {item.metric === "资产负债率" ? `${(item.value * 100).toFixed(2)}%` : item.value.toFixed(3)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700">{item.standard}</td>
                  <td className={`px-3 py-2 text-sm font-semibold ${levelClass(item.level)}`}>
                    {levelText(item.level)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
