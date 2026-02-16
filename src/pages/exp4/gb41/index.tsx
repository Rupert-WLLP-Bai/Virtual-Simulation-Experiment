import { useState } from "react";

export default function Gb41Page() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">GB41 国标功能点度量</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解GB/T 18491系列标准中关于功能点度量的完整规范。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            GB/T 18491标准规定了功能点的定义、测量方法和应用场景，是我国软件度量领域的权威标准。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">标准体系：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>GB/T 18491.1 - 功能点测量总则</li>
            <li>GB/T 18491.2 - 功能点测量定义</li>
            <li>GB/T 18491.3 - 功能点测量应用指南</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>按照GB/T 18491标准确定测量范围</li>
            <li>识别系统边界和用户需求</li>
            <li>进行功能点计数</li>
            <li>应用调整因子</li>
            <li>输出测量报告</li>
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
