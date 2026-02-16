import { useState } from "react";

export default function EvaPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">EVA 挣值分析</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解挣值管理（EVM）的原理，掌握软件项目进度和成本联合控制的方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            挣值分析（Earned Value Analysis, EVA）是一种将项目进度和成本综合分析的绩效评估方法。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">核心指标：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>计划价值 (PV)</strong> - 计划完成工作的预算成本</li>
            <li><strong>挣值 (EV)</strong> - 实际完成工作的预算成本</li>
            <li><strong>实际成本 (AC)</strong> - 实际消耗的成本</li>
            <li><strong>进度偏差 (SV)</strong> - EV - PV</li>
            <li><strong>成本偏差 (CV)</strong> - EV - AC</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>制定项目工作分解结构 (WBS)</li>
            <li>编制项目进度计划和预算</li>
            <li>跟踪项目执行，收集实际数据</li>
            <li>计算 PV、EV、AC 指标</li>
            <li>计算 SV、CV、SPI、CPI 指数</li>
            <li>分析项目绩效，预测完工成本</li>
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
