import { useState } from "react";

export default function JianhuajisuanPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">简化计算模型</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解投资决策简化计算模型的原理，掌握快速估算投资项目经济效益的方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            简化计算模型是在保持主要决策信息的前提下，对复杂投资分析过程进行简化的方法。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">常见简化方法：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>静态投资回收期代替动态回收期</li>
            <li>简化现金流估算</li>
            <li>使用经验系数进行快速估算</li>
            <li>敏感性分析的简化处理</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>分析投资项目的关键参数</li>
            <li>选择合适的简化模型</li>
            <li>收集简化所需的基础数据</li>
            <li>进行简化计算</li>
            <li>验证简化结果的合理性</li>
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
