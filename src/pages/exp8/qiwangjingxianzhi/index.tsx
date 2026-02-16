import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

interface Scenario {
  id: string;
  name: string;
  probability: number;
  npv: number;
}

export default function QiwangjingxianzhiPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: "1", name: "乐观", probability: 0.25, npv: 18000 },
    { id: "2", name: "基准", probability: 0.5, npv: 8000 },
    { id: "3", name: "悲观", probability: 0.25, npv: -5000 },
  ]);

  const probabilitySum = useMemo(
    () => scenarios.reduce((sum, s) => sum + Math.max(0, s.probability), 0),
    [scenarios]
  );

  const normalizedScenarios = useMemo(() => {
    const safe = probabilitySum > 0 ? probabilitySum : 1;
    return scenarios.map((s) => ({
      ...s,
      normalizedProbability: Math.max(0, s.probability) / safe,
    }));
  }, [scenarios, probabilitySum]);

  const enpv = useMemo(
    () =>
      normalizedScenarios.reduce(
        (sum, s) => sum + s.normalizedProbability * s.npv,
        0
      ),
    [normalizedScenarios]
  );

  const downsideProbability = useMemo(
    () =>
      normalizedScenarios
        .filter((s) => s.npv < 0)
        .reduce((sum, s) => sum + s.normalizedProbability, 0),
    [normalizedScenarios]
  );

  const addScenario = () => {
    const id = String(scenarios.length + 1);
    setScenarios([
      ...scenarios,
      { id, name: `情景${id}`, probability: 0, npv: 0 },
    ]);
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const updateScenario = (id: string, patch: Partial<Scenario>) => {
    setScenarios(scenarios.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">期望净现值法</h1>
          <ExportPDF targetId="experiment-content" filename="期望净现值法.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "ENPV", formula: String.raw`ENPV=\sum(P_i\times NPV_i)` },
              { label: "下行风险概率", formula: String.raw`P(NPV<0)=\sum P_i\ (NPV_i<0)` },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">情景输入</h2>
            <button onClick={addScenario} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
              添加情景
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">情景</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">概率</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">NPV（元）</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">归一化概率</th>
                  <th className="px-3 py-2 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {normalizedScenarios.map((s) => (
                  <tr key={s.id} className="border-t border-gray-200">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => updateScenario(s.id, { name: e.target.value })}
                        className="w-full px-2 py-1 exp-input"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={s.probability}
                        onChange={(e) => updateScenario(s.id, { probability: Number(e.target.value) })}
                        className="w-28 px-2 py-1 exp-input"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={s.npv}
                        onChange={(e) => updateScenario(s.id, { npv: Number(e.target.value) })}
                        className="w-32 px-2 py-1 exp-input"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700">{s.normalizedProbability.toFixed(4)}</td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => removeScenario(s.id)} className="text-red-600 hover:text-red-800">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-500">概率和：{probabilitySum.toFixed(4)}（系统会自动归一化）</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatisticCard title="ENPV" value={enpv.toFixed(2)} prefix="¥" valueColor={enpv >= 0 ? "text-green-600" : "text-red-600"} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="下行风险概率" value={(downsideProbability * 100).toFixed(2)} suffix="%" valueColor={downsideProbability <= 0.3 ? "text-green-600" : "text-red-600"} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="最优情景NPV" value={Math.max(...normalizedScenarios.map((s) => s.npv)).toFixed(2)} prefix="¥" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="最差情景NPV" value={Math.min(...normalizedScenarios.map((s) => s.npv)).toFixed(2)} prefix="¥" className="border border-gray-200 rounded-lg p-6" />
        </div>
      </div>
    </div>
  );
}
