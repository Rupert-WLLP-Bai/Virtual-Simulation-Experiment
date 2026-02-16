import { useMemo, useState } from "react";
import { dpp, irr, npv } from "@/lib/calc";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";

export default function YingliPage() {
  const [years, setYears] = useState(5);
  const [discountRatePct, setDiscountRatePct] = useState(10);
  const [requiredReturnPct, setRequiredReturnPct] = useState(12);
  const [totalInvestment, setTotalInvestment] = useState(600000);
  const [equityCapital, setEquityCapital] = useState(350000);
  const [annualRevenue, setAnnualRevenue] = useState(300000);
  const [annualOperatingCost, setAnnualOperatingCost] = useState(170000);
  const [annualTax, setAnnualTax] = useState(25000);
  const [annualDepreciation, setAnnualDepreciation] = useState(40000);
  const [residualValue, setResidualValue] = useState(80000);

  const discountRate = useMemo(() => discountRatePct / 100, [discountRatePct]);
  const requiredReturn = useMemo(() => requiredReturnPct / 100, [requiredReturnPct]);

  const annualProfit = useMemo(
    () => annualRevenue - annualOperatingCost - annualTax,
    [annualRevenue, annualOperatingCost, annualTax]
  );

  const annualCashFlow = useMemo(
    () => annualProfit + annualDepreciation,
    [annualProfit, annualDepreciation]
  );

  const cashFlows = useMemo(() => {
    const flows = [-totalInvestment];
    for (let year = 1; year <= years; year += 1) {
      flows.push(year === years ? annualCashFlow + residualValue : annualCashFlow);
    }
    return flows;
  }, [totalInvestment, years, annualCashFlow, residualValue]);

  const npvValue = useMemo(() => npv(cashFlows, discountRate), [cashFlows, discountRate]);
  const irrValue = useMemo(() => irr(cashFlows), [cashFlows]);
  const dppValue = useMemo(() => dpp(cashFlows, discountRate), [cashFlows, discountRate]);

  const roi = useMemo(
    () => (totalInvestment === 0 ? 0 : annualProfit / totalInvestment),
    [annualProfit, totalInvestment]
  );
  const profitTaxRate = useMemo(
    () => (totalInvestment === 0 ? 0 : (annualProfit + annualTax) / totalInvestment),
    [annualProfit, annualTax, totalInvestment]
  );
  const roe = useMemo(
    () => (equityCapital === 0 ? 0 : annualProfit / equityCapital),
    [annualProfit, equityCapital]
  );
  const pi = useMemo(
    () => (totalInvestment === 0 ? 0 : (npvValue + totalInvestment) / totalInvestment),
    [npvValue, totalInvestment]
  );

  const passedRules = useMemo(() => {
    const passNpv = npvValue >= 0;
    const passIrr = irrValue !== null && irrValue >= requiredReturn;
    const passRoi = roi >= requiredReturn;
    const passPi = pi >= 1;

    return [passNpv, passIrr, passRoi, passPi];
  }, [npvValue, irrValue, requiredReturn, roi, pi]);

  const passCount = useMemo(() => passedRules.filter(Boolean).length, [passedRules]);

  const cumulativeDiscounted = useMemo(() => {
    const values: number[] = [];
    let cumulative = 0;
    for (let t = 0; t < cashFlows.length; t += 1) {
      const discounted = cashFlows[t]! / Math.pow(1 + discountRate, t);
      cumulative += discounted;
      values.push(Math.round(cumulative * 100) / 100);
    }
    return values;
  }, [cashFlows, discountRate]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">盈利能力分析</h1>
          <ExportPDF targetId="experiment-content" filename="盈利能力分析.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "投资利润率", formula: String.raw`ROI = \frac{Profit}{Investment}` },
              { label: "资本金利润率", formula: String.raw`ROE = \frac{Profit}{Equity}` },
              { label: "净现值", formula: String.raw`NPV=\sum_{t=0}^{n}\frac{CF_t}{(1+i)^t}` },
              { label: "获利指数", formula: String.raw`PI=\frac{PV\,(Inflow)}{PV\,(Outflow)}` },
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
              <input
                type="number"
                step="0.1"
                min={0}
                value={discountRatePct}
                onChange={(e) => setDiscountRatePct(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">最低要求收益率（%）</label>
              <input
                type="number"
                step="0.1"
                min={0}
                value={requiredReturnPct}
                onChange={(e) => setRequiredReturnPct(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">总投资（元）</label>
              <input
                type="number"
                min={0}
                value={totalInvestment}
                onChange={(e) => setTotalInvestment(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">资本金（元）</label>
              <input
                type="number"
                min={0}
                value={equityCapital}
                onChange={(e) => setEquityCapital(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">年收入（元）</label>
              <input
                type="number"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">年运营成本（元）</label>
              <input
                type="number"
                value={annualOperatingCost}
                onChange={(e) => setAnnualOperatingCost(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">年税费（元）</label>
              <input
                type="number"
                value={annualTax}
                onChange={(e) => setAnnualTax(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">年折旧（元）</label>
              <input
                type="number"
                value={annualDepreciation}
                onChange={(e) => setAnnualDepreciation(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">期末残值（元）</label>
              <input
                type="number"
                min={0}
                value={residualValue}
                onChange={(e) => setResidualValue(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="投资利润率 ROI" value={`${(roi * 100).toFixed(2)}%`} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="投资利税率" value={`${(profitTaxRate * 100).toFixed(2)}%`} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="资本金利润率 ROE" value={`${(roe * 100).toFixed(2)}%`} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="获利指数 PI" value={pi.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
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
          <StatisticCard title="指标通过数" value={`${passCount}/4`} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">可行性判定</h2>
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">指标</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">计算值</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">标准值</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">判定</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-3 py-2 text-sm text-gray-800">NPV</td>
                <td className="px-3 py-2 text-sm text-gray-700 break-all">{npvValue.toFixed(2)}</td>
                <td className="px-3 py-2 text-sm text-gray-700">≥ 0</td>
                <td className={`px-3 py-2 text-sm font-medium ${passedRules[0] ? "text-green-600" : "text-red-600"}`}>
                  {passedRules[0] ? "通过" : "不通过"}
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-3 py-2 text-sm text-gray-800">IRR</td>
                <td className="px-3 py-2 text-sm text-gray-700">
                  {irrValue === null ? "不可解" : `${(irrValue * 100).toFixed(2)}%`}
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">≥ {requiredReturnPct.toFixed(2)}%</td>
                <td className={`px-3 py-2 text-sm font-medium ${passedRules[1] ? "text-green-600" : "text-red-600"}`}>
                  {passedRules[1] ? "通过" : "不通过"}
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-3 py-2 text-sm text-gray-800">ROI</td>
                <td className="px-3 py-2 text-sm text-gray-700">{(roi * 100).toFixed(2)}%</td>
                <td className="px-3 py-2 text-sm text-gray-700">≥ {requiredReturnPct.toFixed(2)}%</td>
                <td className={`px-3 py-2 text-sm font-medium ${passedRules[2] ? "text-green-600" : "text-red-600"}`}>
                  {passedRules[2] ? "通过" : "不通过"}
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-3 py-2 text-sm text-gray-800">PI</td>
                <td className="px-3 py-2 text-sm text-gray-700">{pi.toFixed(3)}</td>
                <td className="px-3 py-2 text-sm text-gray-700">≥ 1.000</td>
                <td className={`px-3 py-2 text-sm font-medium ${passedRules[3] ? "text-green-600" : "text-red-600"}`}>
                  {passedRules[3] ? "通过" : "不通过"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">累计折现现金流趋势</h2>
          <LineChart
            title=""
            xAxisData={cashFlows.map((_, index) => `Y${index}`)}
            series={[{ name: "累计折现现金流", data: cumulativeDiscounted, color: "#2563eb" }]}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
