import { useState, useMemo } from "react";
import { maxMin, maxMax, hurwicz, laplace, minMaxRegret, type DecisionInput } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";

export default function BuquedingPage() {
  const [input, setInput] = useState<DecisionInput>({
    alternatives: ["方案A", "方案B", "方案C"],
    states: ["状态1", "状态2", "状态3"],
    payoffMatrix: [
      [80, 50, 30],
      [60, 70, 40],
      [40, 60, 80],
    ],
  });
  const [alpha, setAlpha] = useState(0.5);

  const results = useMemo(() => ({
    maxmin: maxMin(input),
    maxmax: maxMax(input),
    hurwicz: hurwicz(input, alpha),
    laplace: laplace(input),
    minmaxregret: minMaxRegret(input),
  }), [input, alpha]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">不确定性决策分析</h1>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">收益矩阵</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">乐观系数 α (0-1)</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              className="w-32 px-3 py-2 exp-select"
            />
          </div>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-gray-800">方案/状态</th>
                {input.states.map((s, i) => (
                  <th key={i} className="border border-gray-300 px-4 py-2 text-gray-800">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {input.alternatives.map((alt, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">{alt}</td>
                  {input.states.map((_, j) => (
                    <td key={j} className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={input.payoffMatrix[i]![j]}
                        onChange={(e) => {
                          const newMatrix = input.payoffMatrix.map((row) => [...row]);
                          newMatrix[i]![j] = Number(e.target.value);
                          setInput({ ...input, payoffMatrix: newMatrix });
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-800"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <StatisticCard title="Max-Min (悲观)" value={results.maxmin.selected} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="Max-Max (乐观)" value={results.maxmax.selected} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="Hurwicz" value={results.hurwicz.selected} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="Laplace" value={results.laplace.selected} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="Min-Max 遗憾" value={results.minmaxregret.selected} className="border border-gray-200 rounded-lg p-6" />
        </div>
      </div>
    </div>
  );
}
