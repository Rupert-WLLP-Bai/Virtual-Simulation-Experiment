import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";

export default function MinjiePage() {
  const [storyPoints, setStoryPoints] = useState(180);
  const [velocity, setVelocity] = useState(30);
  const [teamSize, setTeamSize] = useState(6);
  const [costPerPersonSprint, setCostPerPersonSprint] = useState(12000);

  const sprints = useMemo(() => (velocity > 0 ? storyPoints / velocity : 0), [storyPoints, velocity]);
  const totalCost = useMemo(() => sprints * teamSize * costPerPersonSprint, [sprints, teamSize, costPerPersonSprint]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">敏捷方法规模估算</h1>
          <ExportPDF targetId="experiment-content" filename="敏捷规模估算.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "迭代数", formula: String.raw`SprintCount=\frac{StoryPoints}{Velocity}` },
              { label: "总成本", formula: String.raw`Cost=SprintCount\times TeamSize\times Cost_{person,sprint}` },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">参数输入</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">总故事点</label>
              <input type="number" value={storyPoints} onChange={(e) => setStoryPoints(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">团队速度（点/迭代）</label>
              <input type="number" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">团队人数</label>
              <input type="number" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">人均每迭代成本（元）</label>
              <input type="number" value={costPerPersonSprint} onChange={(e) => setCostPerPersonSprint(Number(e.target.value))} className="w-full px-3 py-2 exp-input" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatisticCard title="预计迭代数" value={sprints.toFixed(2)} className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="预计总成本" value={totalCost.toFixed(2)} prefix="¥" valueColor="text-green-600" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="说明" value={`${storyPoints}/${velocity}`} className="border border-gray-200 rounded-lg p-6" />
        </div>
      </div>
    </div>
  );
}
