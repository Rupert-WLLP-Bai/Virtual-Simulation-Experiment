import { useState } from "react";

export default function NesmaPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">NESMA 功能点度量</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600 mb-2">
            理解NESMA功能点方法原理，通过实验操作掌握功能点法。
          </p>
          <p className="text-gray-600">
            NESMA (Netherlands Software Metrics Association) 方法是ISO国际标准，其中详细功能点方法与IFPUG方法基本等效。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            NESMA方法有三种分析级别：
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>预估功能点分析</strong> - 早期快速估算</li>
            <li><strong>估算功能点分析</strong> - 基于需求概要</li>
            <li><strong>详细功能点分析</strong> - 基于详细需求，与IFPUG等效</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>判定软件系统的工程类型</li>
            <li>识别和确定系统的边界和范围</li>
            <li>功能点分析</li>
            <li>选择合适的NESMA分析级别</li>
            <li>计算功能点数</li>
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
