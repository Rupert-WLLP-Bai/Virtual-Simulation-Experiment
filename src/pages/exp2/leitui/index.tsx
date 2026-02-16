import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

export default function LeituiPage() {
  const [x1, setX1] = useState(100);
  const [y1, setY1] = useState(120);
  const [x2, setX2] = useState(200);
  const [y2, setY2] = useState(210);
  const [xTarget, setXTarget] = useState(160);

  const slope = useMemo(() => (x2 === x1 ? 0 : (y2 - y1) / (x2 - x1)), [x1, y1, x2, y2]);
  const estimate = useMemo(() => y1 + slope * (xTarget - x1), [y1, slope, xTarget, x1]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">类推法软件规模估算</h1>
          <ExportPDF targetId="experiment-content" filename="类推法估算.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            title="类推公式"
            formula={String.raw`Y_t=Y_1+\frac{Y_2-Y_1}{X_2-X_1}\times(X_t-X_1)`}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">参数输入</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">参照点 X1</label>
              <input type="number" value={x1} onChange={(e) => setX1(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">参照规模 Y1</label>
              <input type="number" value={y1} onChange={(e) => setY1(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">参照点 X2</label>
              <input type="number" value={x2} onChange={(e) => setX2(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">参照规模 Y2</label>
              <input type="number" value={y2} onChange={(e) => setY2(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">目标点 Xt</label>
              <input type="number" value={xTarget} onChange={(e) => setXTarget(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatisticCard title="斜率" value={slope.toFixed(4)} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="估算规模" value={estimate.toFixed(2)} valueColor="text-green-600" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="计算过程" value={`${y1} + ${slope.toFixed(4)} × (${xTarget}-${x1})`} className="border border-gray-200 rounded-lg p-6" />
        </div>
      </div>
    </div>
  );
}
