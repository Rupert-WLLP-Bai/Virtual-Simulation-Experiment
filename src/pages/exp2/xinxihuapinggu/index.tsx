import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

export default function XinxihuapingguPage() {
  const [tech, setTech] = useState(80);
  const [business, setBusiness] = useState(75);
  const [risk, setRisk] = useState(65);
  const [compliance, setCompliance] = useState(85);

  const [wTech, setWTech] = useState(0.3);
  const [wBusiness, setWBusiness] = useState(0.3);
  const [wRisk, setWRisk] = useState(0.2);
  const [wCompliance, setWCompliance] = useState(0.2);

  const totalWeight = useMemo(() => wTech + wBusiness + wRisk + wCompliance, [wTech, wBusiness, wRisk, wCompliance]);
  const normalized = useMemo(() => {
    const safe = totalWeight > 0 ? totalWeight : 1;
    return {
      wTech: wTech / safe,
      wBusiness: wBusiness / safe,
      wRisk: wRisk / safe,
      wCompliance: wCompliance / safe,
    };
  }, [wTech, wBusiness, wRisk, wCompliance, totalWeight]);

  const score = useMemo(
    () => tech * normalized.wTech + business * normalized.wBusiness + risk * normalized.wRisk + compliance * normalized.wCompliance,
    [tech, business, risk, compliance, normalized]
  );

  const level = score >= 85 ? "优秀" : score >= 70 ? "良好" : score >= 60 ? "中等" : "需改进";

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">信息化项目评估</h1>
          <ExportPDF targetId="experiment-content" filename="信息化评估.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            title="综合得分"
            formula={String.raw`Score=\sum(Indicator_i\times Weight_i)`}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">指标输入（0~100）</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className="block text-sm text-gray-700 mb-1">技术指标</label><input type="number" value={tech} onChange={(e) => setTech(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">业务价值</label><input type="number" value={business} onChange={(e) => setBusiness(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">风险控制</label><input type="number" value={risk} onChange={(e) => setRisk(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">合规性</label><input type="number" value={compliance} onChange={(e) => setCompliance(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
          </div>

          <h3 className="text-md font-medium text-gray-800 mb-2">权重输入</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className="block text-sm text-gray-700 mb-1">技术权重</label><input type="number" step="0.01" value={wTech} onChange={(e) => setWTech(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">业务权重</label><input type="number" step="0.01" value={wBusiness} onChange={(e) => setWBusiness(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">风险权重</label><input type="number" step="0.01" value={wRisk} onChange={(e) => setWRisk(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">合规权重</label><input type="number" step="0.01" value={wCompliance} onChange={(e) => setWCompliance(Number(e.target.value))} className="w-full px-3 py-2 exp-input" /></div>
          </div>
          <p className="mt-3 text-sm text-gray-500">权重和：{totalWeight.toFixed(2)}（系统会自动归一化）</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatisticCard title="综合得分" value={score.toFixed(2)} valueColor="text-green-600" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="评估等级" value={level} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="说明" value={`${tech}/${business}/${risk}/${compliance}`} className="border border-gray-200 rounded-lg p-6" />
        </div>
      </div>
    </div>
  );
}
