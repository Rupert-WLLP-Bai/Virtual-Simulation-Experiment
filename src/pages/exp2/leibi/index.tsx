import { useState } from "react";

export default function LeibiPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">类比法软件规模估算</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解类比法的原理，通过与已完成的类似项目进行比较来估算新项目的规模。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            类比法是最简单的软件规模估算方法，通过参考历史项目中类似系统的实际规模来估算新项目规模。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">估算步骤：</h3>
          <ol className="list-decimal list-inside text-gray-600 space-y-1">
            <li>选择类似的历史项目</li>
            <li>分析新项目与历史项目的差异</li>
            <li>调整历史项目的规模</li>
            <li>得出估算结果</li>
          </ol>
        </div>

        {/* 实验心得 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验心得</h2>
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
