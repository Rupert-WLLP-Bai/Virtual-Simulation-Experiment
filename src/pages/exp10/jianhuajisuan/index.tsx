import { useMemo, useState } from "react";
import { dpp, irr, npv } from "@/lib/calc";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";

interface CashFlowRow {
  year: number;
  revenue: number;
  cost: number;
  salvage: number;
  netCashFlow: number;
  discountFactor: number;
  discountedCashFlow: number;
  cumulativeDiscountedCashFlow: number;
}

function formatMoney(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "-";
}

export default function JianhuajisuanPage() {
  const [years, setYears] = useState(5);
  const [discountRatePct, setDiscountRatePct] = useState(10);
  const [initialInvestment, setInitialInvestment] = useState(500000);
  const [baseRevenue, setBaseRevenue] = useState(260000);
  const [baseCost, setBaseCost] = useState(140000);
  const [revenueGrowthPct, setRevenueGrowthPct] = useState(4);
  const [costGrowthPct, setCostGrowthPct] = useState(2);
  const [salvageValue, setSalvageValue] = useState(60000);

  const discountRate = useMemo(() => discountRatePct / 100, [discountRatePct]);
  const revenueGrowth = useMemo(() => revenueGrowthPct / 100, [revenueGrowthPct]);
  const costGrowth = useMemo(() => costGrowthPct / 100, [costGrowthPct]);

  const rows = useMemo<CashFlowRow[]>(() => {
    const result: CashFlowRow[] = [];

    let cumulative = -initialInvestment;
    result.push({
      year: 0,
      revenue: 0,
      cost: initialInvestment,
      salvage: 0,
      netCashFlow: -initialInvestment,
      discountFactor: 1,
      discountedCashFlow: -initialInvestment,
      cumulativeDiscountedCashFlow: cumulative,
    });

    for (let year = 1; year <= years; year += 1) {
      const revenue = baseRevenue * Math.pow(1 + revenueGrowth, year - 1);
      const cost = baseCost * Math.pow(1 + costGrowth, year - 1);
      const salvage = year === years ? salvageValue : 0;
      const netCashFlow = revenue - cost + salvage;
      const discountFactor = 1 / Math.pow(1 + discountRate, year);
      const discountedCashFlow = netCashFlow * discountFactor;
      cumulative += discountedCashFlow;

      result.push({
        year,
        revenue,
        cost,
        salvage,
        netCashFlow,
        discountFactor,
        discountedCashFlow,
        cumulativeDiscountedCashFlow: cumulative,
      });
    }

    return result;
  }, [initialInvestment, years, baseRevenue, baseCost, revenueGrowth, costGrowth, salvageValue, discountRate]);

  const cashFlows = useMemo(() => rows.map((row) => row.netCashFlow), [rows]);

  const npvValue = useMemo(() => npv(cashFlows, discountRate), [cashFlows, discountRate]);
  const irrValue = useMemo(() => irr(cashFlows), [cashFlows]);
  const dppValue = useMemo(() => dpp(cashFlows, discountRate), [cashFlows, discountRate]);

  const chartData = useMemo(
    () => ({
      xAxis: rows.map((row) => `Y${row.year}`),
      cumulative: rows.map((row) => Math.round(row.cumulativeDiscountedCashFlow * 100) / 100),
      discounted: rows.map((row) => Math.round(row.discountedCashFlow * 100) / 100),
    }),
    [rows]
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">简化计算模型</h1>
          <ExportPDF targetId="experiment-content" filename="简化计算模型.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            用简化现金流模型快速评估项目财务可行性，核心关注 NPV、IRR、DPP。
          </p>
          <FormulaBlock
            formulas={[
              { label: "净现金流", formula: String.raw`CF_t = Revenue_t - Cost_t + Salvage_t` },
              {
                label: "净现值",
                formula: String.raw`NPV = \sum_{t=0}^{n}\frac{CF_t}{(1+i)^t}`,
              },
              {
                label: "内部收益率",
                formula: String.raw`\sum_{t=0}^{n}\frac{CF_t}{(1+IRR)^t}=0`,
              },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">参数输入</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">寿命期（年）</label>
              <input
                type="number"
                min={1}
                max={10}
                value={years}
                onChange={(e) => setYears(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">折现率 i（%）</label>
              <input
                type="number"
                min={0}
                step="0.1"
                value={discountRatePct}
                onChange={(e) => setDiscountRatePct(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">初始投资（元）</label>
              <input
                type="number"
                min={0}
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">期末残值（元）</label>
              <input
                type="number"
                min={0}
                value={salvageValue}
                onChange={(e) => setSalvageValue(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">首年收入（元）</label>
              <input
                type="number"
                value={baseRevenue}
                onChange={(e) => setBaseRevenue(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">首年成本（元）</label>
              <input
                type="number"
                value={baseCost}
                onChange={(e) => setBaseCost(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">收入增长率（%）</label>
              <input
                type="number"
                step="0.1"
                value={revenueGrowthPct}
                onChange={(e) => setRevenueGrowthPct(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">成本增长率（%）</label>
              <input
                type="number"
                step="0.1"
                value={costGrowthPct}
                onChange={(e) => setCostGrowthPct(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">年度现金流计算表</h2>
          <table className="w-full min-w-[920px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">年份</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">收入</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">成本</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">残值</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">净现金流</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">折现系数</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">折现现金流</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">累计折现现金流</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.year} className="border-t border-gray-200">
                  <td className="px-3 py-2 text-sm text-gray-800">Y{row.year}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.revenue)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.cost)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.salvage)}</td>
                  <td className="px-3 py-2 text-sm text-gray-800 font-medium">{formatMoney(row.netCashFlow)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{row.discountFactor.toFixed(4)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.discountedCashFlow)}</td>
                  <td className="px-3 py-2 text-sm text-gray-800 font-semibold break-all">
                    {formatMoney(row.cumulativeDiscountedCashFlow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="净现值 NPV" value={npvValue.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard
            title="内部收益率 IRR"
            value={irrValue === null ? "不可解" : `${(irrValue * 100).toFixed(2)}%`}
            className="border border-gray-200 rounded-lg p-4"
          />
          <StatisticCard
            title="动态回收期 DPP"
            value={dppValue === null ? "未回收" : `${dppValue.toFixed(2)} 年`}
            className="border border-gray-200 rounded-lg p-4"
          />
          <StatisticCard
            title="结论"
            value={npvValue >= 0 ? "财务可行" : "财务不可行"}
            className="border border-gray-200 rounded-lg p-4"
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">折现现金流趋势</h2>
          <LineChart
            title=""
            xAxisData={chartData.xAxis}
            series={[
              { name: "年度折现现金流", data: chartData.discounted, color: "#2563eb" },
              { name: "累计折现现金流", data: chartData.cumulative, color: "#16a34a" },
            ]}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
