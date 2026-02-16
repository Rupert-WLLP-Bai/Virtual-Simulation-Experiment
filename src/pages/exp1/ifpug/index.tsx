import { useState } from "react";

export default function IfpugPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">IFPUG 功能点度量</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600 mb-2">
            理解IFPUG功能点方法原理，通过实验操作掌握功能点法。
          </p>
          <p className="text-gray-600">
            IFPUG (International Function Point Users Group) 是最广泛使用的功能点分析方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            IFPUG方法基于软件系统需求和设计模型分析，得到软件系统实现功能所具备的功能点。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">功能点类型：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>ILF - 内部逻辑文件</li>
            <li>EIF - 外部接口文件</li>
            <li>EI - 外部输入</li>
            <li>EO - 外部输出</li>
            <li>EQ - 外部查询</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>判定软件系统的工程类型</li>
            <li>识别和确定系统的边界和范围</li>
            <li>功能点分析 - 识别ILF、EIF、EI、EO、EQ</li>
            <li>确定每个组件的复杂度等级</li>
            <li>计算未调整功能点数 UFP</li>
            <li>计算调整因子 VAF</li>
            <li>计算最终功能点 FP = UFP × VAF</li>
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
