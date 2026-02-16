import { useState, useMemo } from "react";
import { StatisticCard } from "@/components/ui/statistic-card";
import { FormulaBlock } from "@/components/ui/formula";
import { ExportPDF } from "@/components/ui/export-pdf";

interface CashFlowInput {
  operating_revenue: number[];
  recovery_of_residual_value_of_fixed_assets: number[];
  recovery_of_residual_value_of_intangible_assets: number[];
  working_capital: number[];
  construction_investment: number[];
  liudong_money: number[];
  operation_cost: number[];
  maintain_operational_investment: number[];
  taxes_and_surcharges: number[];
  discount_rate: number;
}

export default function DongtaitouziPage() {
  const [input, setInput] = useState<CashFlowInput>({
    operating_revenue: [0, 500, 600, 700, 800, 900],
    recovery_of_residual_value_of_fixed_assets: [0, 0, 0, 0, 0, 100],
    recovery_of_residual_value_of_intangible_assets: [0, 0, 0, 0, 0, 50],
    working_capital: [0, 0, 0, 0, 0, 80],
    construction_investment: [1000, 0, 0, 0, 0, 0],
    liudong_money: [100, 0, 0, 0, 0, 0],
    operation_cost: [0, 200, 250, 300, 350, 400],
    maintain_operational_investment: [0, 0, 0, 0, 0, 0],
    taxes_and_surcharges: [0, 30, 35, 40, 45, 55],
    discount_rate: 0.1,
  });

  const years = [0, 1, 2, 3, 4, 5];

  const cashFlowData = useMemo(() => {
    const { operating_revenue, recovery_of_residual_value_of_fixed_assets,
            recovery_of_residual_value_of_intangible_assets, working_capital,
            construction_investment, liudong_money, operation_cost,
            maintain_operational_investment, taxes_and_surcharges, discount_rate } = input;

    const cashInflow = years.map((_, i) =>
      operating_revenue[i] + recovery_of_residual_value_of_fixed_assets[i] +
      recovery_of_residual_value_of_intangible_assets[i] + working_capital[i]
    );

    const cashOutflow = years.map((_, i) =>
      construction_investment[i] + liudong_money[i] + operation_cost[i] +
      maintain_operational_investment[i] + taxes_and_surcharges[i]
    );

    const netCashFlow = years.map((_, i) => cashInflow[i] - cashOutflow[i]);

    const accumulatedNetCashFlow = years.map((_, i) =>
      netCashFlow.slice(0, i + 1).reduce((a, b) => a + b, 0)
    );

    const presentValueFactor = years.map((_, i) =>
      parseFloat((1 / Math.pow(1 + discount_rate, i)).toFixed(4))
    );

    const presentNetCashFlow = years.map((_, i) =>
      parseFloat((netCashFlow[i] * presentValueFactor[i]).toFixed(4))
    );

    const preAccumulatedNetCashFlow = years.map((_, i) =>
      presentNetCashFlow.slice(0, i + 1).reduce((a, b) => a + b, 0)
    );

    // Find the year where accumulated present value becomes positive
    let positiveYear = -1;
    for (let i = 0; i < preAccumulatedNetCashFlow.length; i++) {
      if (preAccumulatedNetCashFlow[i] >= 0) {
        positiveYear = i;
        break;
      }
    }

    // Calculate dynamic payback period
    let dpp = 0;
    if (positiveYear === -1) {
      dpp = -1; // Never recovered
    } else if (positiveYear === 0) {
      dpp = 0;
    } else {
      const lastNegative = preAccumulatedNetCashFlow[positiveYear - 1];
      const currentPresentValue = presentNetCashFlow[positiveYear];
      dpp = parseFloat((positiveYear - 1 + Math.abs(lastNegative) / currentPresentValue).toFixed(4));
    }

    return {
      cashInflow,
      cashOutflow,
      netCashFlow,
      accumulatedNetCashFlow,
      presentValueFactor,
      presentNetCashFlow,
      preAccumulatedNetCashFlow,
      positiveYear,
      dpp,
    };
  }, [input]);

  const updateValue = (field: keyof CashFlowInput, index: number, value: number) => {
    const newArray = [...input[field]];
    newArray[index] = value;
    setInput({ ...input, [field]: newArray });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">动态投资回收期实验</h1>
          <ExportPDF targetId="experiment-content" filename="动态投资回收期.pdf" />
        </div>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600 mb-2">
            1. 理解国家标准《软件测试成本度量规范》中软件测试成本度量原理，通过实验操作，掌握软件测试成本度量过程
          </p>
          <p className="text-gray-600 mb-2">
            2. 以小组为单位，根据本小组"软件工程管理与经济"课程设计项目架构及组件等设计成果，使用《软件测试成本度量规范》中的方法，估算该项目的测试成本
          </p>
          <p className="text-gray-600">
            3. 本实验旨在通过动态投资回收期的计算方法，评估软件开发项目的投资回收期，并分析项目的经济效益和风险。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>
          <p className="text-gray-600">
            动态投资回收期（Dynamic Payback Period）是一种用于评估投资回报率的方法，其基本原理是将投资成本与现金流量相比较，计算出从投资开始到投资收回的时间，即投资回收期。
            动态投资回收期相较于传统的投资回收期更加精细，能够考虑现金流量的时间价值因素，能够更准确地评估投资的回报率和风险。
          </p>
          <FormulaBlock
            formulas={[
              { label: "动态投资回收期", formula: "DPP = (累计折现值出现正值的年数 - 1) + 上年累计折现值的绝对值 / 当年净现金流量的折现值" },
              { label: "现值系数", formula: "PVF = 1 / (1 + i)^n" },
            ]}
          />
        </div>

        {/* 参数设置 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤 - 参数设置</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">折现率</label>
            <input
              type="number"
              step="0.01"
              value={input.discount_rate}
              onChange={(e) => setInput({ ...input, discount_rate: Number(e.target.value) })}
              className="w-full px-3 py-2 exp-input"
            />
          </div>

          {/* 现金流入 */}
          <h3 className="text-md font-medium text-gray-700 mb-3">现金流入</h3>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">项目/年份</th>
                  {years.map((y) => (
                    <th key={y} className="border px-4 py-2 text-center text-sm font-medium text-gray-700">{y}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">营业收入</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.operating_revenue[i]}
                        onChange={(e) => updateValue("operating_revenue", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">回收固定资产余值</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.recovery_of_residual_value_of_fixed_assets[i]}
                        onChange={(e) => updateValue("recovery_of_residual_value_of_fixed_assets", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">回收无形资产余值</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.recovery_of_residual_value_of_intangible_assets[i]}
                        onChange={(e) => updateValue("recovery_of_residual_value_of_intangible_assets", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">回收流动资金</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.working_capital[i]}
                        onChange={(e) => updateValue("working_capital", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50 font-medium">
                  <td className="border px-4 py-2 text-sm text-gray-700">现金流入合计</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-4 py-2 text-center text-sm text-gray-700">
                      {cashFlowData.cashInflow[i]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* 现金流出 */}
          <h3 className="text-md font-medium text-gray-700 mb-3">现金流出</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">项目/年份</th>
                  {years.map((y) => (
                    <th key={y} className="border px-4 py-2 text-center text-sm font-medium text-gray-700">{y}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">建设投资</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.construction_investment[i]}
                        onChange={(e) => updateValue("construction_investment", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">流动资金</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.liudong_money[i]}
                        onChange={(e) => updateValue("liudong_money", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">经营成本</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.operation_cost[i]}
                        onChange={(e) => updateValue("operation_cost", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">维持运营投资</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.maintain_operational_investment[i]}
                        onChange={(e) => updateValue("maintain_operational_investment", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">营业税金及附加</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-2 py-1">
                      <input
                        type="number"
                        value={input.taxes_and_surcharges[i]}
                        onChange={(e) => updateValue("taxes_and_surcharges", i, Number(e.target.value))}
                        className="w-full px-2 py-1 exp-input text-center"
                      />
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50 font-medium">
                  <td className="border px-4 py-2 text-sm text-gray-700">现金流出合计</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-4 py-2 text-center text-sm text-gray-700">
                      {cashFlowData.cashOutflow[i]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 计算结果 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">四、实验内容 - 计算结果</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">项目/年份</th>
                  {years.map((y) => (
                    <th key={y} className="border px-4 py-2 text-center text-sm font-medium text-gray-700">{y}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">净现金流量</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-4 py-2 text-center text-sm text-gray-700">
                      {cashFlowData.netCashFlow[i]}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">累计净现金流量</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-4 py-2 text-center text-sm text-gray-700">
                      {cashFlowData.accumulatedNetCashFlow[i]}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">现值系数</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-4 py-2 text-center text-sm text-gray-700">
                      {cashFlowData.presentValueFactor[i]}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm text-gray-600">净现金流量(现值)</td>
                  {years.map((_, i) => (
                    <td key={i} className="border px-4 py-2 text-center text-sm text-gray-700">
                      {cashFlowData.presentNetCashFlow[i]}
                    </td>
                  ))}
                </tr>
                <tr className={cashFlowData.positiveYear >= 0 ? "bg-green-50" : ""}>
                  <td className="border px-4 py-2 text-sm text-gray-600">累计净现金流量(现值)</td>
                  {years.map((_, i) => (
                    <td
                      key={i}
                      className={`border px-4 py-2 text-center text-sm ${
                        cashFlowData.positiveYear === i ? "text-green-600 font-bold" : "text-gray-700"
                      }`}
                    >
                      {cashFlowData.preAccumulatedNetCashFlow[i].toFixed(4)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatisticCard
            title="累计净现值由负转正的年份"
            value={cashFlowData.positiveYear >= 0 ? cashFlowData.positiveYear : "未回收"}
            valueColor={cashFlowData.positiveYear >= 0 ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="动态投资回收期"
            value={cashFlowData.dpp >= 0 ? cashFlowData.dpp : "未回收"}
            suffix={cashFlowData.dpp >= 0 ? "年" : ""}
            valueColor={cashFlowData.dpp >= 0 ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
        </div>

        {/* 实验结果 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">五、实验结果</h2>
          <p className="text-gray-600 mb-4">
            通过动态投资回收期的计算，可以评估该项目的投资回报情况。动态投资回收期越短，说明项目投资风险越小，经济效益越好。
          </p>
        </div>

        {/* 实验思考 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">六、实验思考</h2>
          <p className="text-gray-600 mb-4">
            思考题：1. 动态投资回收期与静态投资回收期相比，有何优势？2. 折现率对动态投资回收期有何影响？
          </p>
        </div>
      </div>
    </div>
  );
}
