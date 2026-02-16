import { useState } from "react";

export default function LeituiPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">类推法软件规模估算</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解类推法的原理，通过已知子系统的规模来推算整个项目的规模。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            类推法是基于已知的子系统或模块的规模，按比例推算整个系统规模的方法。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">估算步骤：</h3>
          <ol className="list-decimal list-inside text-gray-600 space-y-1">
            <li>确定新项目的子系统划分</li>
            <li>收集已完成的类似子系统数据</li>
            <li>分析各子系统的复杂度差异</li>
            <li>按比例推算各子系统规模</li>
            <li>汇总得到总规模</li>
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
