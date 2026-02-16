import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

export default function ChongzhiqiPage() {
  const [oldAnnualCost, setOldAnnualCost] = useState(8000);
  const [newAnnualCost, setNewAnnualCost] = useState(4500);
  const [newInvestment, setNewInvestment] = useState(28000);
  const [oldSalvage, setOldSalvage] = useState(4000);
  const [discountRate, setDiscountRate] = useState(0.1);
  const [maxYears, setMaxYears] = useState(15);

  const initialGap = useMemo(() => Math.max(0, newInvestment - oldSalvage), [newInvestment, oldSalvage]);
  const annualSaving = useMemo(() => oldAnnualCost - newAnnualCost, [oldAnnualCost, newAnnualCost]);

  const resetResult = useMemo(() => {
    if (annualSaving <= 0) {
      return { year: -1, pvSaving: 0 };
    }

    let cumulative = 0;
    for (let n = 1; n <= maxYears; n++) {
      cumulative += annualSaving / Math.pow(1 + discountRate, n);
      if (cumulative >= initialGap) {
        return { year: n, pvSaving: cumulative };
      }
    }

    return { year: -1, pvSaving: cumulative };
  }, [annualSaving, maxYears, discountRate, initialGap]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">重置期实验</h1>
          <ExportPDF targetId="experiment-content" filename="重置期.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "初始资金缺口", formula: String.raw`Gap=I_{new}-S_{old}` },
              { label: "第n年累计折现节约", formula: String.raw`PV_{save}(n)=\sum_{t=1}^{n}\frac{(C_{old}-C_{new})}{(1+r)^t}` },
              { label: "重置期", formula: String.raw`n^*=\min\{n\mid PV_{save}(n)\ge Gap\}` },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">参数输入</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><label className="block text-sm text-gray-700 mb-1">旧设备年成本（元）</label><input type="number" value={oldAnnualCost} onChange={(e) => setOldAnnualCost(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">新设备年成本（元）</label><input type="number" value={newAnnualCost} onChange={(e) => setNewAnnualCost(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">新设备投资额（元）</label><input type="number" value={newInvestment} onChange={(e) => setNewInvestment(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">旧设备残值（元）</label><input type="number" value={oldSalvage} onChange={(e) => setOldSalvage(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">折现率</label><input type="number" step="0.01" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">最大评估年限</label><input type="number" min={1} value={maxYears} onChange={(e) => setMaxYears(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatisticCard title="初始缺口" value={initialGap.toFixed(2)} prefix="¥" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="年节约额" value={annualSaving.toFixed(2)} prefix="¥" valueColor={annualSaving > 0 ? "text-green-600" : "text-red-600"} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="累计折现节约" value={resetResult.pvSaving.toFixed(2)} prefix="¥" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="重置期" value={resetResult.year > 0 ? `${resetResult.year} 年` : "未达到"} valueColor={resetResult.year > 0 ? "text-green-600" : "text-red-600"} className="border border-gray-200 rounded-lg p-6" />
        </div>
      </div>
    </div>
  );
}
