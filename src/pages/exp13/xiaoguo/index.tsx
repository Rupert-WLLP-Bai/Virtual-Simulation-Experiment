import { useState } from "react";

export default function XiaoguoPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">效果分析</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解软件项目效果分析的原理，掌握评估项目实施效果的方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            效果分析是评估投资项目实际产生的效果与预期目标的符合程度。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">分析维度：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>目标达成度</strong> - 实际成果与预期目标的比较</li>
            <li><strong>效率分析</strong> - 投入产出比分析</li>
            <li><strong>质量评估</strong> - 成果质量评价</li>
            <li><strong>用户满意度</strong> - 用户对项目成果的满意程度</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>确定效果评估指标</li>
            <li>收集效果数据</li>
            <li>计算效果指标值</li>
            <li>与预期目标比较</li>
            <li>编写效果分析报告</li>
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
