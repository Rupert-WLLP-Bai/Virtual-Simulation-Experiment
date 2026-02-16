import { useState } from "react";

export default function QiwangjingxianzhiPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">期望净现值法</h1>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600">
            理解期望净现值法的原理，掌握在不确定性条件下的投资决策分析方法。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            期望净现值法（Expected NPV）是将不同情景下的净现值按概率加权平均的决策方法。
          </p>
          <h3 className="font-medium text-gray-700 mb-2">计算公式：</h3>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <p className="text-gray-700">ENPV = Σ(Pᵢ × NPVᵢ)</p>
            <p className="text-gray-500 text-sm mt-2">其中：Pᵢ 为情景 i 发生的概率，NPVᵢ 为情景 i 的净现值</p>
          </div>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>识别投资方案可能面临的各种情景</li>
            <li>估计各情景发生的概率</li>
            <li>计算各情景下的净现值</li>
            <li>计算期望净现值</li>
            <li>根据 ENPV 进行投资决策</li>
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
