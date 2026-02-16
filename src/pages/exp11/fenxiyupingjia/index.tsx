import { useMemo, useState } from "react";
import { dpp, irr, npv } from "@/lib/calc";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

interface SchemeResult {
  name: string;
  cashFlows: number[];
  npv: number;
  irr: number | null;
  dpp: number | null;
  score: number;
}

function buildCashFlows(initial: number, annualNet: number, residual: number, years: number): number[] {
  const flows = [-initial];
  for (let year = 1; year <= years; year += 1) {
    flows.push(year === years ? annualNet + residual : annualNet);
  }
  return flows;
}

function safeNormalize(value: number, min: number, max: number): number {
  if (max <= min) return 1;
  return (value - min) / (max - min);
}

export default function FenxiyupingjiaPage() {
  const [years, setYears] = useState(5);
  const [discountRatePct, setDiscountRatePct] = useState(10);

  const [aInitial, setAInitial] = useState(550000);
  const [aAnnualNet, setAAnnualNet] = useState(165000);
  const [aResidual, setAResidual] = useState(70000);
  const [aRiskScore, setARiskScore] = useState(78);

  const [bInitial, setBInitial] = useState(620000);
  const [bAnnualNet, setBAnnualNet] = useState(192000);
  const [bResidual, setBResidual] = useState(90000);
  const [bRiskScore, setBRiskScore] = useState(70);

  const discountRate = useMemo(() => discountRatePct / 100, [discountRatePct]);

  const baseResults = useMemo(() => {
    const aCashFlows = buildCashFlows(aInitial, aAnnualNet, aResidual, years);
    const bCashFlows = buildCashFlows(bInitial, bAnnualNet, bResidual, years);

    return [
      {
        name: "方案 A",
        cashFlows: aCashFlows,
        npv: npv(aCashFlows, discountRate),
        irr: irr(aCashFlows),
        dpp: dpp(aCashFlows, discountRate),
        riskScore: Math.max(0, Math.min(100, aRiskScore)),
      },
      {
        name: "方案 B",
        cashFlows: bCashFlows,
        npv: npv(bCashFlows, discountRate),
        irr: irr(bCashFlows),
        dpp: dpp(bCashFlows, discountRate),
        riskScore: Math.max(0, Math.min(100, bRiskScore)),
      },
    ];
  }, [aInitial, aAnnualNet, aResidual, bInitial, bAnnualNet, bResidual, years, discountRate, aRiskScore, bRiskScore]);

  const results = useMemo<SchemeResult[]>(() => {
    const npvValues = baseResults.map((item) => item.npv);
    const irrValues = baseResults.map((item) => item.irr ?? -1);
    const dppValues = baseResults.map((item) => item.dpp ?? Number.POSITIVE_INFINITY);

    const npvMin = Math.min(...npvValues);
    const npvMax = Math.max(...npvValues);
    const irrMin = Math.min(...irrValues);
    const irrMax = Math.max(...irrValues);

    const finiteDpp = dppValues.filter(Number.isFinite);
    const dppMin = finiteDpp.length > 0 ? Math.min(...finiteDpp) : 0;
    const dppMax = finiteDpp.length > 0 ? Math.max(...finiteDpp) : 1;

    return baseResults.map((item) => {
      const npvScore = safeNormalize(item.npv, npvMin, npvMax) * 40;
      const irrScore = safeNormalize(item.irr ?? -1, irrMin, irrMax) * 30;

      const dppRaw = item.dpp;
      const dppScore =
        dppRaw === null || !Number.isFinite(dppRaw)
          ? 0
          : safeNormalize(dppMax - dppRaw, dppMax - dppMax, dppMax - dppMin) * 20;

      const riskScore = (item.riskScore / 100) * 10;
      const score = npvScore + irrScore + dppScore + riskScore;

      return {
        name: item.name,
        cashFlows: item.cashFlows,
        npv: item.npv,
        irr: item.irr,
        dpp: item.dpp,
        score: Math.round(score * 100) / 100,
      };
    });
  }, [baseResults]);

  const bestScheme = useMemo(() => {
    const sorted = [...results].sort((a, b) => b.score - a.score);
    return sorted[0] ?? null;
  }, [results]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">分析与评价</h1>
          <ExportPDF targetId="experiment-content" filename="分析与评价.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            通过 NPV、IRR、DPP 与风险评分的综合加权，对多个备选方案进行对比评价。
          </p>
          <FormulaBlock
            formulas={[
              { label: "净现值", formula: String.raw`NPV=\sum_{t=0}^{n}\frac{CF_t}{(1+i)^t}` },
              { label: "内部收益率", formula: String.raw`\sum_{t=0}^{n}\frac{CF_t}{(1+IRR)^t}=0` },
              { label: "动态回收期", formula: String.raw`DPP=m-1+\frac{|CumPV_{m-1}|}{PV_m}` },
              {
                label: "综合评分",
                formula: String.raw`Score=0.4S_{NPV}+0.3S_{IRR}+0.2S_{DPP}+0.1S_{Risk}`,
              },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">全局参数</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">方案 A 输入</h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">初始投资（元）</label>
                <input type="number" value={aInitial} onChange={(e) => setAInitial(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">年净现金流（元）</label>
                <input type="number" value={aAnnualNet} onChange={(e) => setAAnnualNet(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">期末残值（元）</label>
                <input type="number" value={aResidual} onChange={(e) => setAResidual(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">风险评分（0~100）</label>
                <input type="number" min={0} max={100} value={aRiskScore} onChange={(e) => setARiskScore(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">方案 B 输入</h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">初始投资（元）</label>
                <input type="number" value={bInitial} onChange={(e) => setBInitial(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">年净现金流（元）</label>
                <input type="number" value={bAnnualNet} onChange={(e) => setBAnnualNet(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">期末残值（元）</label>
                <input type="number" value={bResidual} onChange={(e) => setBResidual(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">风险评分（0~100）</label>
                <input type="number" min={0} max={100} value={bRiskScore} onChange={(e) => setBRiskScore(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">对比结果</h2>
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">方案</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">NPV</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">IRR</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">DPP</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">综合评分</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.name} className="border-t border-gray-200">
                  <td className="px-3 py-2 text-sm text-gray-800">{item.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-700 break-all">{item.npv.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">
                    {item.irr === null ? "不可解" : `${(item.irr * 100).toFixed(2)}%`}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700">
                    {item.dpp === null ? "未回收" : `${item.dpp.toFixed(2)} 年`}
                  </td>
                  <td className="px-3 py-2 text-sm font-semibold text-gray-800">{item.score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatisticCard
            title="推荐方案"
            value={bestScheme?.name ?? "-"}
            className="border border-gray-200 rounded-lg p-4"
          />
          <StatisticCard
            title="推荐方案评分"
            value={bestScheme ? bestScheme.score.toFixed(2) : "-"}
            className="border border-gray-200 rounded-lg p-4"
          />
          <StatisticCard
            title="结论"
            value={bestScheme ? `${bestScheme.name} 综合表现更优` : "暂无结论"}
            className="border border-gray-200 rounded-lg p-4"
          />
        </div>
      </div>
    </div>
  );
}
