import { useState } from "react";

export default function MinjiePage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">敏捷方法软件规模估算</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解敏捷开发方法下的软件规模估算原理，掌握基于用户故事点的估算方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            敏捷方法使用"故事点"作为规模单位，而不是传统的功能点。故事点反映的是工作的相对复杂度。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">常用估算技术：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>规划扑克</strong> - 团队共识估算</li>
            <li><strong>T-Shirt sizing</strong> - S/M/L/XL分类</li>
            <li><strong>亲和估算</strong> - 分类排序法</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>拆分用户故事为可估算的任务</li>
            <li>使用规划扑克进行团队估算</li>
            <li>讨论并达成共识</li>
            <li>计算故事点总数</li>
            <li>根据速率计算迭代周期</li>
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
