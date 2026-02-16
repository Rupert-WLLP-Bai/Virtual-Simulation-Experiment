import { useState } from "react";

export default function Gb31Page() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">GB31 国标功能点度量</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解国家标准GB/T 18491关于功能点度量的具体规定和方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600">
            GB/T 18491系列标准是我国软件功能点度量的国家标准，规定了功能点方法的测量原理、计算规则和应用指南。
          </p>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>确定测量范围和边界</li>
            <li>识别功能用户需求</li>
            <li>识别和计数功能点类型</li>
            <li>确定复杂度</li>
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
