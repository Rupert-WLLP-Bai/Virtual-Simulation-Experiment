import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

export default function BoyiPage() {
  const [a11, setA11] = useState(8);
  const [a12, setA12] = useState(3);
  const [a21, setA21] = useState(2);
  const [a22, setA22] = useState(6);

  const rowMins = useMemo(() => [Math.min(a11, a12), Math.min(a21, a22)], [a11, a12, a21, a22]);
  const colMaxs = useMemo(() => [Math.max(a11, a21), Math.max(a12, a22)], [a11, a12, a21, a22]);
  const maximin = useMemo(() => Math.max(...rowMins), [rowMins]);
  const minimax = useMemo(() => Math.min(...colMaxs), [colMaxs]);
  const hasSaddlePoint = useMemo(() => Math.abs(maximin - minimax) < 1e-9, [maximin, minimax]);

  const mixed = useMemo(() => {
    const denom = a11 - a12 - a21 + a22;
    if (denom === 0 || hasSaddlePoint) return null;

    const p = (a22 - a21) / denom;
    const q = (a22 - a12) / denom;
    const value = (a11 * a22 - a12 * a21) / denom;

    if (!Number.isFinite(p) || !Number.isFinite(q) || p < 0 || p > 1 || q < 0 || q > 1) {
      return null;
    }

    return {
      p,
      q,
      value,
    };
  }, [a11, a12, a21, a22, hasSaddlePoint]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">博弈论决策实验（2×2）</h1>
          <ExportPDF targetId="experiment-content" filename="博弈论决策.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "纯策略判定", formula: String.raw`\max_i\min_j a_{ij}\ ?=\ \min_j\max_i a_{ij}` },
              { label: "混合策略", formula: String.raw`p=\frac{a_{22}-a_{21}}{a_{11}-a_{12}-a_{21}+a_{22}},\ q=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}` },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">玩家A收益矩阵</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-xl">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-sm text-gray-700">A\\B</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-700">B1</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-700">B2</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-3 py-2 text-sm text-gray-700">A1</td>
                  <td className="px-3 py-2"><input type="number" value={a11} onChange={(e) => setA11(Number(e.target.value))} className="w-24 px-2 py-1 exp-input" /></td>
                  <td className="px-3 py-2"><input type="number" value={a12} onChange={(e) => setA12(Number(e.target.value))} className="w-24 px-2 py-1 exp-input" /></td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-3 py-2 text-sm text-gray-700">A2</td>
                  <td className="px-3 py-2"><input type="number" value={a21} onChange={(e) => setA21(Number(e.target.value))} className="w-24 px-2 py-1 exp-input" /></td>
                  <td className="px-3 py-2"><input type="number" value={a22} onChange={(e) => setA22(Number(e.target.value))} className="w-24 px-2 py-1 exp-input" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="Maximin" value={maximin} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="Minimax" value={minimax} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="鞍点判定" value={hasSaddlePoint ? "存在" : "不存在"} valueColor={hasSaddlePoint ? "text-green-600" : "text-orange-600"} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="建议" value={hasSaddlePoint ? "纯策略" : "混合策略"} className="border border-gray-200 rounded-lg p-6" />
        </div>

        {!hasSaddlePoint && mixed !== null && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatisticCard title="A选择A1概率 p" value={mixed.p.toFixed(4)} className="border border-gray-200 rounded-lg p-6" />
            <StatisticCard title="B选择B1概率 q" value={mixed.q.toFixed(4)} className="border border-gray-200 rounded-lg p-6" />
            <StatisticCard title="博弈值" value={mixed.value.toFixed(4)} className="border border-gray-200 rounded-lg p-6" />
          </div>
        )}
      </div>
    </div>
  );
}
