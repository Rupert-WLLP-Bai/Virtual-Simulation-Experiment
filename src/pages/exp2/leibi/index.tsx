import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

export default function LeibiPage() {
  const [history1, setHistory1] = useState(120);
  const [history2, setHistory2] = useState(150);
  const [history3, setHistory3] = useState(135);
  const [similarity, setSimilarity] = useState(0.9);
  const [complexityAdj, setComplexityAdj] = useState(1.1);

  const avgSize = useMemo(() => (history1 + history2 + history3) / 3, [history1, history2, history3]);
  const estimate = useMemo(() => avgSize * similarity * complexityAdj, [avgSize, similarity, complexityAdj]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">类比法软件规模估算</h1>
          <ExportPDF targetId="experiment-content" filename="类比法估算.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            title="类比估算公式"
            formula={String.raw`Size_{new}=\overline{Size}_{history}\times Similarity\times ComplexityAdj`}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">参数输入</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">历史项目1规模</label>
              <input type="number" value={history1} onChange={(e) => setHistory1(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">历史项目2规模</label>
              <input type="number" value={history2} onChange={(e) => setHistory2(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">历史项目3规模</label>
              <input type="number" value={history3} onChange={(e) => setHistory3(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">相似度系数</label>
              <input type="number" step="0.01" value={similarity} onChange={(e) => setSimilarity(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">复杂度调整系数</label>
              <input type="number" step="0.01" value={complexityAdj} onChange={(e) => setComplexityAdj(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatisticCard title="历史均值" value={avgSize.toFixed(2)} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="估算规模" value={estimate.toFixed(2)} valueColor="text-green-600" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="计算过程" value={`${avgSize.toFixed(2)} × ${similarity} × ${complexityAdj}`} className="border border-gray-200 rounded-lg p-6" />
        </div>
      </div>
    </div>
  );
}
