import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";

interface BenefitRow {
  year: number;
  benefit: number;
  cost: number;
  discountFactor: number;
  pvBenefit: number;
  pvCost: number;
  cumulativeNetBenefit: number;
}

function formatMoney(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "-";
}

export default function XiaoyiPage() {
  const [years, setYears] = useState(5);
  const [discountRatePct, setDiscountRatePct] = useState(10);
  const [initialCost, setInitialCost] = useState(380000);
  const [annualEconomicBenefit, setAnnualEconomicBenefit] = useState(170000);
  const [annualSocialBenefit, setAnnualSocialBenefit] = useState(30000);
  const [annualOperatingCost, setAnnualOperatingCost] = useState(70000);
  const [benefitGrowthPct, setBenefitGrowthPct] = useState(3);
  const [costGrowthPct, setCostGrowthPct] = useState(2);

  const discountRate = useMemo(() => discountRatePct / 100, [discountRatePct]);
  const benefitGrowth = useMemo(() => benefitGrowthPct / 100, [benefitGrowthPct]);
  const costGrowth = useMemo(() => costGrowthPct / 100, [costGrowthPct]);

  const rows = useMemo<BenefitRow[]>(() => {
    const list: BenefitRow[] = [];
    let cumulativeNetBenefit = -initialCost;

    for (let year = 1; year <= years; year += 1) {
      const annualBenefit = (annualEconomicBenefit + annualSocialBenefit) * Math.pow(1 + benefitGrowth, year - 1);
      const annualCost = annualOperatingCost * Math.pow(1 + costGrowth, year - 1);
      const discountFactor = 1 / Math.pow(1 + discountRate, year);
      const pvBenefit = annualBenefit * discountFactor;
      const pvCost = annualCost * discountFactor;
      cumulativeNetBenefit += pvBenefit - pvCost;

      list.push({
        year,
        benefit: annualBenefit,
        cost: annualCost,
        discountFactor,
        pvBenefit,
        pvCost,
        cumulativeNetBenefit,
      });
    }

    return list;
  }, [years, annualEconomicBenefit, annualSocialBenefit, annualOperatingCost, benefitGrowth, costGrowth, discountRate, initialCost]);

  const totalPvBenefit = useMemo(
    () => rows.reduce((sum, row) => sum + row.pvBenefit, 0),
    [rows]
  );

  const totalPvCost = useMemo(
    () => initialCost + rows.reduce((sum, row) => sum + row.pvCost, 0),
    [rows, initialCost]
  );

  const netPresentBenefit = useMemo(() => totalPvBenefit - totalPvCost, [totalPvBenefit, totalPvCost]);

  const bcRatio = useMemo(() => {
    if (totalPvCost === 0) return 0;
    return totalPvBenefit / totalPvCost;
  }, [totalPvBenefit, totalPvCost]);

  const discountedPayback = useMemo(() => {
    const firstPositive = rows.find((row) => row.cumulativeNetBenefit >= 0);
    if (firstPositive === undefined) return null;

    if (firstPositive.year === 1) {
      return firstPositive.cumulativeNetBenefit === 0
        ? 1
        : 1 - firstPositive.cumulativeNetBenefit / (firstPositive.pvBenefit - firstPositive.pvCost);
    }

    const prev = rows[firstPositive.year - 2];
    if (prev === undefined) return firstPositive.year;

    const currentDelta = firstPositive.pvBenefit - firstPositive.pvCost;
    if (currentDelta === 0) return firstPositive.year;

    return firstPositive.year - 1 + Math.abs(prev.cumulativeNetBenefit) / currentDelta;
  }, [rows]);

  const conclusion = useMemo(() => {
    if (bcRatio >= 1 && netPresentBenefit >= 0) return "效益可接受，建议实施。";
    if (bcRatio >= 0.9) return "效益边际可接受，建议优化后实施。";
    return "效益不足，建议调整方案。";
  }, [bcRatio, netPresentBenefit]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">效益分析</h1>
          <ExportPDF targetId="experiment-content" filename="效益分析.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "净现值效益", formula: String.raw`NPB=PV(Benefit)-PV(Cost)` },
              { label: "效益费用比", formula: String.raw`B/C=\frac{PV(Benefit)}{PV(Cost)}` },
              { label: "折现效益", formula: String.raw`PV_t=\frac{Value_t}{(1+i)^t}` },
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
              <label className="block text-sm text-gray-700 mb-1">折现率（%）</label>
              <input type="number" min={0} step="0.1" value={discountRatePct} onChange={(e) => setDiscountRatePct(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">初始成本（元）</label>
              <input type="number" min={0} value={initialCost} onChange={(e) => setInitialCost(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">年运行成本（元）</label>
              <input type="number" min={0} value={annualOperatingCost} onChange={(e) => setAnnualOperatingCost(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">年经济效益（元）</label>
              <input type="number" min={0} value={annualEconomicBenefit} onChange={(e) => setAnnualEconomicBenefit(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">年社会效益（元）</label>
              <input type="number" min={0} value={annualSocialBenefit} onChange={(e) => setAnnualSocialBenefit(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">效益增长率（%）</label>
              <input type="number" step="0.1" value={benefitGrowthPct} onChange={(e) => setBenefitGrowthPct(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">成本增长率（%）</label>
              <input type="number" step="0.1" value={costGrowthPct} onChange={(e) => setCostGrowthPct(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="效益现值 PV(B)" value={totalPvBenefit.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="成本现值 PV(C)" value={totalPvCost.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="净现值效益 NPB" value={netPresentBenefit.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="效益费用比 B/C" value={bcRatio.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatisticCard
            title="折现回收期"
            value={discountedPayback === null ? "未回收" : `${discountedPayback.toFixed(2)} 年`}
            className="border border-gray-200 rounded-lg p-4"
          />
          <StatisticCard title="综合结论" value={conclusion} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">年度效益明细</h2>
          <table className="w-full min-w-[920px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">年份</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">年度效益</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">年度成本</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">折现系数</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">折现效益</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">折现成本</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">累计净现值效益</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.year} className="border-t border-gray-200">
                  <td className="px-3 py-2 text-sm text-gray-800">Y{row.year}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.benefit)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.cost)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{row.discountFactor.toFixed(4)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.pvBenefit)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{formatMoney(row.pvCost)}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-gray-800 break-all">{formatMoney(row.cumulativeNetBenefit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">累计净现值效益趋势</h2>
          <LineChart
            title=""
            xAxisData={rows.map((row) => `Y${row.year}`)}
            series={[
              {
                name: "累计净现值效益",
                data: rows.map((row) => Math.round(row.cumulativeNetBenefit * 100) / 100),
                color: "#2563eb",
              },
            ]}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
