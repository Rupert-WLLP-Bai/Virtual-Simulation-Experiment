import { useState } from "react";

export default function BoyiPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">博弈论投资决策</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解博弈论在投资决策中的应用，掌握不完全信息下的决策分析方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            博弈论是研究决策者在存在相互影响的策略互动情况下的决策行为的理论。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">基本概念：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>博弈方</strong> - 参与决策的主体</li>
            <li><strong>策略</strong> - 各博弈方可选择的行动集合</li>
            <li><strong>收益</strong> - 博弈结果对各方的利益影响</li>
            <li><strong>均衡</strong> - 各方都无法单方面改善的策略组合</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>识别投资决策中的博弈各方</li>
            <li>分析各方的策略空间</li>
            <li>构建收益矩阵</li>
            <li>求解博弈均衡</li>
            <li>分析均衡结果的经济含义</li>
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
