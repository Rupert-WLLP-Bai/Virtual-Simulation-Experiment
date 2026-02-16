import { useState } from "react";

export default function XinxihuapingguPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">信息化评估</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解信息化项目评估的原理和方法，掌握软件项目信息化水平评估的技术。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            信息化评估是对软件项目或系统进行综合评价的过程，包括技术评估、经济评估、管理评估等多个维度。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">评估维度：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>技术成熟度评估</li>
            <li>经济效益评估</li>
            <li>管理水平评估</li>
            <li>用户满意度评估</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>确定评估对象和范围</li>
            <li>选择评估指标体系</li>
            <li>收集评估数据</li>
            <li>进行指标权重赋值</li>
            <li>计算综合评估得分</li>
            <li>编写评估报告</li>
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
