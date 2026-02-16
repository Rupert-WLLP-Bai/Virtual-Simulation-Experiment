import { useState } from "react";

export default function FenxiyupingjiaPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">分析与评价</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解软件项目分析与评价的原理，掌握项目综合评估的方法和技术。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            软件项目分析与评价是对项目的技术、经济、社会等各方面影响进行综合评估的过程。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">评价内容：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>技术可行性分析</li>
            <li>经济效益评价</li>
            <li>社会影响评估</li>
            <li>风险分析与评价</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>确定评价目标和范围</li>
            <li>选择评价指标体系</li>
            <li>收集评价数据</li>
            <li>进行综合评价</li>
            <li>编写评价报告</li>
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
