import { useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";

export default function ChongzhiqiPage() {
  const [thoughts, setThoughts] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">重置期实验</h1>
          <ExportPDF targetId="experiment-content" filename="重置期.pdf" />
        </div>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600 mb-2">
            1. 理解重置期（Reset Period）的概念及其在投资决策中的应用
          </p>
          <p className="text-gray-600 mb-2">
            2. 掌握重置期的计算方法和原理
          </p>
          <p className="text-gray-600">
            3. 通过实验分析，了解重置期对投资决策的影响
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600 mb-4">
            重置期是指在考虑设备或资产更新换代的情况下，计算投资回收所需的时间。
            当设备或资产需要在新旧之间进行选择时，重置期分析可以帮助决策者确定最佳更新时机。
          </p>
          <p className="text-gray-600">
            重置期的计算需要考虑现有资产的残值、新资产的投资成本、运营成本以及资金的时间价值等因素。
          </p>
        </div>

        {/* 实验步骤 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤</h2>
          <h3 className="text-md font-medium text-gray-700 mb-3">3.1 确定现有资产信息</h3>
          <p className="text-gray-600 mb-4">
            收集现有资产的原始投资、残值、已使用年限等相关信息。
          </p>

          <h3 className="text-md font-medium text-gray-700 mb-3">3.2 确定新资产投资方案</h3>
          <p className="text-gray-600 mb-4">
            确定新设备的投资成本、预期使用年限、运营成本等参数。
          </p>

          <h3 className="text-md font-medium text-gray-700 mb-3">3.3 计算重置期</h3>
          <p className="text-gray-600">
            根据资金时间价值原理，计算使新旧资产总成本相等的年限，即为重置期。
          </p>
        </div>

        {/* 参数设置 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">四、实验内容 - 参数设置</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">现有资产原值（元）</label>
              <input
                type="number"
                className="w-full px-3 py-2 exp-input"
                placeholder="请输入现有资产原值"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">现有资产残值（元）</label>
              <input
                type="number"
                className="w-full px-3 py-2 exp-input"
                placeholder="请输入现有资产残值"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">现有资产已使用年限</label>
              <input
                type="number"
                className="w-full px-3 py-2 exp-input"
                placeholder="请输入已使用年限"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新资产投资额（元）</label>
              <input
                type="number"
                className="w-full px-3 py-2 exp-input"
                placeholder="请输入新资产投资额"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新资产预计使用年限</label>
              <input
                type="number"
                className="w-full px-3 py-2 exp-input"
                placeholder="请输入预计使用年限"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">折现率（%）</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 exp-input"
                placeholder="请输入折现率"
              />
            </div>
          </div>
        </div>

        {/* 实验结果 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">五、实验结果</h2>
          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="请输入实验结果分析..."
            className="w-full px-3 py-2 exp-textarea"
            rows={4}
          />
        </div>

        {/* 实验思考 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">六、实验思考</h2>
          <p className="text-gray-600 mb-4">
            思考题：1. 重置期分析在实际企业投资决策中有何应用价值？
          </p>
          <p className="text-gray-600 mb-4">
            2. 影响重置期计算的关键因素有哪些？
          </p>
          <p className="text-gray-600">
            3. 如何在实际工作中应用重置期分析方法进行设备更新决策？
          </p>
        </div>
      </div>
    </div>
  );
}
