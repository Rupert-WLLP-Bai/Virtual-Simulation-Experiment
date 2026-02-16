import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

export default function XiaoguoPage() {
  const [totalCost, setTotalCost] = useState(460000);
  const [targetOutput, setTargetOutput] = useState(1200);
  const [actualOutput, setActualOutput] = useState(1080);
  const [qualityScorePct, setQualityScorePct] = useState(88);
  const [beneficiaryCount, setBeneficiaryCount] = useState(3500);
  const [benchmarkCostPerEffectiveUnit, setBenchmarkCostPerEffectiveUnit] = useState(520);

  const qualityFactor = useMemo(() => Math.max(0, Math.min(1, qualityScorePct / 100)), [qualityScorePct]);

  const targetAchievement = useMemo(() => {
    if (targetOutput === 0) return 0;
    return actualOutput / targetOutput;
  }, [actualOutput, targetOutput]);

  const effectiveOutput = useMemo(() => actualOutput * qualityFactor, [actualOutput, qualityFactor]);

  const costPerOutput = useMemo(() => {
    if (actualOutput === 0) return 0;
    return totalCost / actualOutput;
  }, [totalCost, actualOutput]);

  const costPerEffectiveOutput = useMemo(() => {
    if (effectiveOutput === 0) return 0;
    return totalCost / effectiveOutput;
  }, [totalCost, effectiveOutput]);

  const costPerBeneficiary = useMemo(() => {
    if (beneficiaryCount === 0) return 0;
    return totalCost / beneficiaryCount;
  }, [totalCost, beneficiaryCount]);

  const costEffectivenessIndex = useMemo(() => {
    if (costPerEffectiveOutput === 0) return 0;
    return benchmarkCostPerEffectiveUnit / costPerEffectiveOutput;
  }, [benchmarkCostPerEffectiveUnit, costPerEffectiveOutput]);

  const overallScore = useMemo(() => {
    const achievementScore = Math.min(targetAchievement, 1.2) / 1.2;
    const quality = qualityFactor;
    const ceScore = Math.min(costEffectivenessIndex, 1.5) / 1.5;
    return (achievementScore * 0.45 + quality * 0.2 + ceScore * 0.35) * 100;
  }, [targetAchievement, qualityFactor, costEffectivenessIndex]);

  const conclusion = useMemo(() => {
    if (overallScore >= 80) return "效果良好，投入产出关系优。";
    if (overallScore >= 60) return "效果中等，建议优化关键环节。";
    return "效果偏弱，建议重构实施方案。";
  }, [overallScore]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">效果分析</h1>
          <ExportPDF targetId="experiment-content" filename="效果分析.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "目标达成率", formula: String.raw`Achievement=\frac{Actual\ Output}{Target\ Output}` },
              { label: "有效产出", formula: String.raw`Effective\ Output=Actual\ Output\times Quality\ Score` },
              {
                label: "单位有效产出成本",
                formula: String.raw`CE\ Cost=\frac{Total\ Cost}{Effective\ Output}`,
              },
              {
                label: "成本效果指数",
                formula: String.raw`CE\ Index=\frac{Benchmark\ Cost}{CE\ Cost}`,
              },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">参数输入</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">项目总成本（元）</label>
              <input type="number" min={0} value={totalCost} onChange={(e) => setTotalCost(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">目标产出量</label>
              <input type="number" min={0} value={targetOutput} onChange={(e) => setTargetOutput(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">实际产出量</label>
              <input type="number" min={0} value={actualOutput} onChange={(e) => setActualOutput(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">质量得分（%）</label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={qualityScorePct}
                onChange={(e) => setQualityScorePct(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">受益人数</label>
              <input type="number" min={0} value={beneficiaryCount} onChange={(e) => setBeneficiaryCount(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">基准单位有效产出成本（元）</label>
              <input
                type="number"
                min={1}
                value={benchmarkCostPerEffectiveUnit}
                onChange={(e) => setBenchmarkCostPerEffectiveUnit(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="目标达成率" value={`${(targetAchievement * 100).toFixed(2)}%`} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="有效产出量" value={effectiveOutput.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="单位产出成本" value={costPerOutput.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="单位有效产出成本" value={costPerEffectiveOutput.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="人均成本" value={costPerBeneficiary.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="成本效果指数" value={costEffectivenessIndex.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="综合效果评分" value={`${overallScore.toFixed(2)} / 100`} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="结论" value={conclusion} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">判定依据</h2>
          <table className="w-full min-w-[680px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">维度</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">当前值</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">建议阈值</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">结果</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-3 py-2 text-sm text-gray-800">目标达成率</td>
                <td className="px-3 py-2 text-sm text-gray-700">{(targetAchievement * 100).toFixed(2)}%</td>
                <td className="px-3 py-2 text-sm text-gray-700">>= 100%</td>
                <td className={`px-3 py-2 text-sm font-medium ${targetAchievement >= 1 ? "text-green-600" : "text-amber-600"}`}>
                  {targetAchievement >= 1 ? "达标" : "未达标"}
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-3 py-2 text-sm text-gray-800">成本效果指数</td>
                <td className="px-3 py-2 text-sm text-gray-700">{costEffectivenessIndex.toFixed(3)}</td>
                <td className="px-3 py-2 text-sm text-gray-700">>= 1.000</td>
                <td className={`px-3 py-2 text-sm font-medium ${costEffectivenessIndex >= 1 ? "text-green-600" : "text-red-600"}`}>
                  {costEffectivenessIndex >= 1 ? "优于基准" : "低于基准"}
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-3 py-2 text-sm text-gray-800">质量得分</td>
                <td className="px-3 py-2 text-sm text-gray-700">{qualityScorePct.toFixed(2)}%</td>
                <td className="px-3 py-2 text-sm text-gray-700">>= 85%</td>
                <td className={`px-3 py-2 text-sm font-medium ${qualityScorePct >= 85 ? "text-green-600" : "text-amber-600"}`}>
                  {qualityScorePct >= 85 ? "达标" : "需优化"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
