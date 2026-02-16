import { useState } from "react";

export default function ShengcunPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">生存能力分析</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解投资项目生存能力分析的方法，掌握评估项目长期可持续发展的指标体系。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            生存能力分析是评估投资项目在长期内能否持续经营和发展的能力，是项目可行性研究的重要组成部分。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">分析维度：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>财务生存能力</strong> - 现金流能否覆盖各项支出</li>
            <li><strong>技术生存能力</strong> - 技术更新和适应能力</li>
            <li><strong>市场生存能力</strong> - 持续的市场竞争力</li>
            <li><strong>管理生存能力</strong> - 组织和管理持续改进能力</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>分析项目财务可持续性</li>
            <li>评估技术发展风险</li>
            <li>分析市场变化趋势</li>
            <li>评估管理和组织能力</li>
            <li>综合得出生存能力结论</li>
          </ol>
        </div>

        {/* 实验心得 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">四、实验心得</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="写下你的心得"
            className="exp-input w-full h-32 p-3 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
