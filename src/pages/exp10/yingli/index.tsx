import { useState } from "react";

export default function YingliPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">盈利能力分析</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解投资项目盈利能力分析的方法，掌握评估投资方案经济效益的指标体系。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            盈利能力分析是评估投资项目经济效益的核心内容，主要分析项目能否产生足够的利润回报投资。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">主要指标：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>投资利润率</strong> - 年利润 / 投资总额</li>
            <li><strong>投资利税率</strong> - (年利润+年税金) / 投资总额</li>
            <li><strong>资本金利润率</strong> - 利润 / 资本金</li>
            <li><strong>净现值 (NPV)</strong> - 现金流折现总和</li>
            <li><strong>内部收益率 (IRR)</strong> - NPV=0 时的折现率</li>
          </ul>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>收集项目投资和收益数据</li>
            <li>计算各项盈利指标</li>
            <li>与行业基准进行比较</li>
            <li>分析盈利能力的不确定性</li>
            <li>得出盈利能力结论</li>
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
