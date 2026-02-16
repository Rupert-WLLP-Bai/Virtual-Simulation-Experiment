import { useState } from "react";

export default function XiaoyiPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">效益分析</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解软件项目效益分析的原理，掌握评估项目经济效益和社会效益的方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            效益分析是评估投资项目所产生的各种效益，包括经济效益、社会效益、环境效益等。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">效益类型：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>直接效益</strong> - 项目产生的可直接量化的效益</li>
            <li><strong>间接效益</strong> - 项目产生的间接影响效益</li>
            <li><strong>社会效益</strong> - 项目对社会的影响</li>
            <li><strong>环境效益</strong> - 项目对环境的影响</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>识别项目各类效益</li>
            <li>确定效益量化方法</li>
            <li>收集效益数据</li>
            <li>计算各类效益值</li>
            <li>编写效益分析报告</li>
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
