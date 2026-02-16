import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";

interface MonthlyRow {
  month: number;
  revenue: number;
  variableCost: number;
  fixedCost: number;
  debtService: number;
  netCashFlow: number;
  cumulativeCash: number;
}

function formatMoney(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "-";
}

export default function ShengcunPage() {
  const [openingCash, setOpeningCash] = useState(500000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(120000);
  const [monthlyRevenueGrowthPct, setMonthlyRevenueGrowthPct] = useState(1);
  const [monthlyFixedCost, setMonthlyFixedCost] = useState(80000);
  const [variableCostRatePct, setVariableCostRatePct] = useState(20);
  const [monthlyDebtService, setMonthlyDebtService] = useState(10000);
  const [horizonMonths, setHorizonMonths] = useState(24);
  const [warningMonths, setWarningMonths] = useState(6);

  const growthRate = useMemo(() => monthlyRevenueGrowthPct / 100, [monthlyRevenueGrowthPct]);
  const variableRate = useMemo(() => variableCostRatePct / 100, [variableCostRatePct]);

  const rows = useMemo<MonthlyRow[]>(() => {
    const data: MonthlyRow[] = [];
    let cumulative = openingCash;

    for (let month = 1; month <= horizonMonths; month += 1) {
      const revenue = monthlyRevenue * Math.pow(1 + growthRate, month - 1);
      const variableCost = revenue * variableRate;
      const netCashFlow = revenue - variableCost - monthlyFixedCost - monthlyDebtService;
      cumulative += netCashFlow;

      data.push({
        month,
        revenue,
        variableCost,
        fixedCost: monthlyFixedCost,
        debtService: monthlyDebtService,
        netCashFlow,
        cumulativeCash: cumulative,
      });
    }

    return data;
  }, [openingCash, horizonMonths, monthlyRevenue, growthRate, variableRate, monthlyFixedCost, monthlyDebtService]);

  const breakEvenRevenue = useMemo(() => {
    const denominator = 1 - variableRate;
    if (denominator <= 0) return Infinity;
    return (monthlyFixedCost + monthlyDebtService) / denominator;
  }, [variableRate, monthlyFixedCost, monthlyDebtService]);

  const simulatedRunway = useMemo(() => {
    let cumulative = openingCash;

    for (let month = 1; month <= 240; month += 1) {
      const revenue = monthlyRevenue * Math.pow(1 + growthRate, month - 1);
      const variableCost = revenue * variableRate;
      const netCashFlow = revenue - variableCost - monthlyFixedCost - monthlyDebtService;
      cumulative += netCashFlow;
      if (cumulative <= 0) {
        return month;
      }
    }

    return null;
  }, [openingCash, monthlyRevenue, growthRate, variableRate, monthlyFixedCost, monthlyDebtService]);

  const minCash = useMemo(() => {
    const values = rows.map((row) => row.cumulativeCash);
    values.push(openingCash);
    return Math.min(...values);
  }, [rows, openingCash]);

  const finalCash = useMemo(() => rows[rows.length - 1]?.cumulativeCash ?? openingCash, [rows, openingCash]);

  const survivalIndex = useMemo(() => {
    if (simulatedRunway === null) return Number.POSITIVE_INFINITY;
    return simulatedRunway / warningMonths;
  }, [simulatedRunway, warningMonths]);

  const conclusion = useMemo(() => {
    if (simulatedRunway === null) return "在当前参数下，现金储备可持续。";
    if (simulatedRunway < warningMonths) return "生存风险高，建议立即优化收入结构或降本。";
    if (simulatedRunway < warningMonths * 2) return "生存能力一般，建议设置现金预警与应急措施。";
    return "短中期生存能力可控。";
  }, [simulatedRunway, warningMonths]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">生存能力分析</h1>
          <ExportPDF targetId="experiment-content" filename="生存能力分析.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "月净现金流", formula: String.raw`NetCF_t=Revenue_t-VariableCost_t-FixedCost-DebtService` },
              { label: "累计现金", formula: String.raw`Cash_t=Cash_{t-1}+NetCF_t` },
              {
                label: "盈亏平衡收入",
                formula: String.raw`BreakEven\ Revenue=\frac{FixedCost+DebtService}{1-Variable\ Cost\ Rate}`,
              },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">参数输入</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">期初现金（元）</label>
              <input type="number" value={openingCash} onChange={(e) => setOpeningCash(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">首月收入（元）</label>
              <input type="number" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">月收入增长率（%）</label>
              <input type="number" step="0.1" value={monthlyRevenueGrowthPct} onChange={(e) => setMonthlyRevenueGrowthPct(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">变动成本率（%）</label>
              <input type="number" min={0} max={95} step="0.1" value={variableCostRatePct} onChange={(e) => setVariableCostRatePct(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">月固定成本（元）</label>
              <input type="number" value={monthlyFixedCost} onChange={(e) => setMonthlyFixedCost(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">月债务支出（元）</label>
              <input type="number" value={monthlyDebtService} onChange={(e) => setMonthlyDebtService(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">分析周期（月）</label>
              <input
                type="number"
                min={1}
                max={60}
                value={horizonMonths}
                onChange={(e) => setHorizonMonths(Math.max(1, Math.min(60, Number(e.target.value) || 1)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">预警阈值（月）</label>
              <input
                type="number"
                min={1}
                max={24}
                value={warningMonths}
                onChange={(e) => setWarningMonths(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="盈亏平衡月收入" value={Number.isFinite(breakEvenRevenue) ? breakEvenRevenue.toFixed(2) : "不可达"} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="现金跑道" value={simulatedRunway === null ? "240+ 月" : `${simulatedRunway} 月`} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="最低现金余额" value={minCash.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard
            title="生存指数"
            value={Number.isFinite(survivalIndex) ? survivalIndex.toFixed(2) : "∞"}
            className="border border-gray-200 rounded-lg p-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatisticCard title="期末现金余额" value={finalCash.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="综合结论" value={conclusion} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">月度现金流明细</h2>
          <table className="w-full min-w-[980px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">月份</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">收入</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">变动成本</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">固定成本</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">债务支出</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">净现金流</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">累计现金</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.month} className="border-t border-gray-200">
                  <td className="px-3 py-2 text-sm text-gray-800">M{row.month}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.revenue)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.variableCost)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.fixedCost)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.debtService)}</td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-800">{formatMoney(row.netCashFlow)}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-gray-800 break-all">{formatMoney(row.cumulativeCash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">累计现金趋势</h2>
          <LineChart
            title=""
            xAxisData={rows.map((row) => `M${row.month}`)}
            series={[{ name: "累计现金", data: rows.map((row) => Math.round(row.cumulativeCash * 100) / 100), color: "#2563eb" }]}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
