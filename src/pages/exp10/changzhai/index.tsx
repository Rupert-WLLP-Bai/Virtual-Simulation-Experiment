import { useState } from "react";

export default function ChangzhaiPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">偿债能力分析</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解投资项目偿债能力分析的方法，掌握评估项目财务风险的指标体系。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            偿债能力分析是评估投资项目能否按期偿还债务本息的能力，是财务风险分析的重要内容。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">主要指标：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>流动比率</strong> - 流动资产 / 流动负债</li>
            <li><strong>速动比率</strong> - (流动资产-存货) / 流动负债</li>
            <li><strong>资产负债率</strong> - 负债总额 / 资产总额</li>
            <li><strong>利息保障倍数</strong> - EBIT / 利息费用</li>
            <li><strong>借款偿还期</strong> - 偿还借款所需年数</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>收集项目资产负债数据</li>
            <li>计算各项偿债能力指标</li>
            <li>与行业标准进行比较</li>
            <li>分析偿债风险</li>
            <li>得出偿债能力结论</li>
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
