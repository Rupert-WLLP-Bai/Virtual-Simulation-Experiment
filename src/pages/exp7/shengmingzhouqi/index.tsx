import { useState, useMemo } from "react";
import { StatisticCard } from "@/components/ui/statistic-card";
import { FormulaBlock } from "@/components/ui/formula";
import { ExportPDF } from "@/components/ui/export-pdf";

interface TableRow {
  key: number;
  year: number;
  salvageValue: string;
  omCost: string;
  cr: string;
  pwOm: string;
  sumOm: string;
  aeOm: string;
  totalAe: string;
}

export default function ShengmingzhouqiPage() {
  const [rate, setRate] = useState<number>(0.1);
  const [tableData, setTableData] = useState<TableRow[]>(
    Array.from({ length: 8 }, (_, i) => ({
      key: i,
      year: i + 1,
      salvageValue: String((8 - i) * 1000),
      omCost: String((i + 1) * 1000),
      cr: "",
      pwOm: "",
      sumOm: "",
      aeOm: "",
      totalAe: "",
    }))
  );

  // 计算年金现值系数 P/A,i,n
  const calculatePA = (i: number, n: number): number => {
    let sum = 0;
    for (let j = 1; j <= n; j++) {
      sum += 1 / Math.pow(1 + i, j);
    }
    return sum;
  };

  // 计算复利现值系数 P/F,i,n
  const calculatePF = (i: number, n: number): number => {
    return 1 / Math.pow(1 + i, n);
  };

  const calculatedData = useMemo(() => {
    const P = 10000; // 初始投资
    const results = tableData.map((row) => {
      const n = row.year;
      const F = parseFloat(row.salvageValue) || 0;
      const OM = parseFloat(row.omCost) || 0;

      // 资本回收 CR(i) = (P - F) * (A/P,i,n) + F * i
      // 其中 (A/P,i,n) = 1 / (P/A,i,n)
      const PA = calculatePA(rate, n);
      const AP = PA > 0 ? 1 / PA : 0;
      const cr = (P - F) * AP + F * rate;

      // 运维费用现值 PW(i) of O&M
      const pf = calculatePF(rate, n);
      const pwOm = OM * pf;

      return { cr, pwOm, PA };
    });

    // 计算累计运维费用和AE
    let sumOm = 0;
    const updatedData = results.map((result, index) => {
      sumOm += result.pwOm;
      const PA = calculatePA(rate, tableData[index].year);
      const aeOm = PA > 0 ? sumOm / PA : 0;
      const totalAe = result.cr + aeOm;

      return {
        ...tableData[index],
        cr: isNaN(result.cr) ? "" : result.cr.toFixed(0),
        pwOm: isNaN(result.pwOm) ? "" : result.pwOm.toFixed(0),
        sumOm: sumOm.toFixed(0),
        aeOm: isNaN(aeOm) ? "" : aeOm.toFixed(0),
        totalAe: isNaN(totalAe) ? "" : totalAe.toFixed(0),
      };
    });

    return updatedData;
  }, [tableData, rate]);

  const minTotalAe = useMemo(() => {
    const values = calculatedData.map((row) => {
      const val = parseFloat(row.totalAe);
      return isNaN(val) ? Infinity : val;
    });
    return Math.min(...values);
  }, [calculatedData]);

  const optimalYear = useMemo(() => {
    const minIndex = calculatedData.findIndex(
      (row) => Math.abs(parseFloat(row.totalAe) - minTotalAe) < 0.01
    );
    return minIndex >= 0 ? minIndex + 1 : 0;
  }, [calculatedData, minTotalAe]);

  const updateRowValue = (index: number, field: keyof TableRow, value: string) => {
    const newData = [...tableData];
    newData[index] = { ...newData[index], [field]: value };
    setTableData(newData);
  };

  // 辅助系数表数据
  const paTableData = [
    { year: 1, r6: 0.943, r7: 0.935, r8: 0.926, r9: 0.917, r10: 0.909, r11: 0.901, r12: 0.893, r13: 0.885, r14: 0.877, r15: 0.870 },
    { year: 2, r6: 1.833, r7: 1.808, r8: 1.783, r9: 1.759, r10: 1.736, r11: 1.713, r12: 1.690, r13: 1.668, r14: 1.647, r15: 1.626 },
    { year: 3, r6: 2.673, r7: 2.624, r8: 2.577, r9: 2.531, r10: 2.487, r11: 2.444, r12: 2.402, r13: 2.361, r14: 2.322, r15: 2.283 },
    { year: 4, r6: 3.465, r7: 3.387, r8: 3.312, r9: 3.240, r10: 3.170, r11: 3.102, r12: 3.037, r13: 2.975, r14: 2.914, r15: 2.855 },
    { year: 5, r6: 4.212, r7: 4.100, r8: 3.993, r9: 3.890, r10: 3.791, r11: 3.696, r12: 3.605, r13: 3.517, r14: 3.433, r15: 3.352 },
    { year: 6, r6: 4.917, r7: 4.767, r8: 4.623, r9: 4.486, r10: 4.355, r11: 4.231, r12: 4.111, r13: 3.998, r14: 3.889, r15: 3.785 },
    { year: 7, r6: 5.582, r7: 5.389, r8: 5.206, r9: 5.033, r10: 4.868, r11: 4.712, r12: 4.564, r13: 4.423, r14: 4.288, r15: 4.160 },
    { year: 8, r6: 6.210, r7: 5.971, r8: 5.747, r9: 5.535, r10: 5.335, r11: 5.146, r12: 4.968, r13: 4.799, r14: 4.639, r15: 4.487 },
  ];

  const pfTableData = [
    { year: 1, r6: 0.9434, r7: 0.9346, r8: 0.9259, r9: 0.9174, r10: 0.9091, r11: 0.9009, r12: 0.8929, r13: 0.8850, r14: 0.8772, r15: 0.8696 },
    { year: 2, r6: 0.8900, r7: 0.8734, r8: 0.8573, r9: 0.8417, r10: 0.8264, r11: 0.8116, r12: 0.7972, r13: 0.7831, r14: 0.7695, r15: 0.7561 },
    { year: 3, r6: 0.8396, r7: 0.8163, r8: 0.7938, r9: 0.7722, r10: 0.7513, r11: 0.7312, r12: 0.7118, r13: 0.6931, r14: 0.6750, r15: 0.6575 },
    { year: 4, r6: 0.7921, r7: 0.7629, r8: 0.7350, r9: 0.7084, r10: 0.6830, r11: 0.6587, r12: 0.6355, r13: 0.6133, r14: 0.5921, r15: 0.5718 },
    { year: 5, r6: 0.7473, r7: 0.7130, r8: 0.6806, r9: 0.6499, r10: 0.6209, r11: 0.5935, r12: 0.5674, r13: 0.5428, r14: 0.5194, r15: 0.4972 },
    { year: 6, r6: 0.7050, r7: 0.6663, r8: 0.6302, r9: 0.5963, r10: 0.5645, r11: 0.5346, r12: 0.5066, r13: 0.4803, r14: 0.4556, r15: 0.4323 },
    { year: 7, r6: 0.6651, r7: 0.6227, r8: 0.5835, r9: 0.5470, r10: 0.5132, r11: 0.4817, r12: 0.4523, r13: 0.4251, r14: 0.3996, r15: 0.3759 },
    { year: 8, r6: 0.6274, r7: 0.5820, r8: 0.5403, r9: 0.5019, r10: 0.4665, r11: 0.4339, r12: 0.4039, r13: 0.3762, r14: 0.3506, r15: 0.3269 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">软件经济生命周期计算实验</h1>
          <ExportPDF targetId="experiment-content" filename="生命周期.pdf" />
        </div>

        {/* 实验目的 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">一、实验目的</h2>
          <p className="text-gray-600 mb-2">
            软件经济生命周期计算是一种用于评估软件产品在其整个生命周期中的经济效益和成本的方法。
          </p>
          <p className="text-gray-600">
            该实验的目的是通过进行软件经济生命周期计算，以评估软件产品的经济可行性，并为软件开发和维护过程中的决策提供依据。
          </p>
        </div>

        {/* 实验原理 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">二、实验原理</h2>

          <h3 className="text-md font-medium text-gray-700 mb-2">1. 软件生命周期</h3>
          <p className="text-gray-600 mb-4">
            软件生命周期(Software Life Cycle, SLC)是软件的产生直到报废或停止使用的生命周期。
            软件的成本主要包括两部分：资本回收CR(i)与运维成本O&M Cost。
          </p>

          <h3 className="text-md font-medium text-gray-700 mb-2">2. 经济学相关概念</h3>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>残值(Salvage Value)：在一项资产使用期满时预计能够回收到的残余价值</li>
            <li>资本回收CR(i)：由资产价值下降值和隐形成本组成</li>
            <li>现值系数(P/F,i,n)：复利现值系数</li>
            <li>年金现值系数(P/A,i,n)：等额支付的现值系数</li>
          </ul>

          <FormulaBlock
            formulas={[
              { label: "资本回收 CR(i)", formula: "CR(i) = (P - F) * (A/P,i,n) + F * i" },
              { label: "复利现值系数 P/F", formula: "P/F = 1 / (1 + i)^n" },
              { label: "总经济成本", formula: "Total AE(i) = CR(i) + AE(i) of O&M" },
            ]}
          />
        </div>

        {/* 参数设置 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">三、实验步骤 - 参数设置</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">请输入年收益率 i = </label>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-32 px-3 py-2 exp-input"
            />
          </div>

          <p className="text-gray-600 mb-4">
            请填写下表中的残值(Salvage Value)和运维费用(O&M Cost)：
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-3 py-2 text-xs font-medium text-gray-700">年份</th>
                  <th className="border px-3 py-2 text-xs font-medium text-gray-700">残值(步骤1)</th>
                  <th className="border px-3 py-2 text-xs font-medium text-gray-700">运维费用(步骤1)</th>
                  <th className="border px-3 py-2 text-xs font-medium text-gray-700">资本回收(步骤2)</th>
                  <th className="border px-3 py-2 text-xs font-medium text-gray-700">运维现值(步骤2)</th>
                  <th className="border px-3 py-2 text-xs font-medium text-gray-700">累计运维(步骤3)</th>
                  <th className="border px-3 py-2 text-xs font-medium text-gray-700">运维AE(步骤3)</th>
                  <th className="border px-3 py-2 text-xs font-medium text-gray-700 bg-green-50">总成本(步骤4)</th>
                </tr>
              </thead>
              <tbody>
                {calculatedData.map((row, index) => (
                  <tr key={row.key} className={index + 1 === optimalYear ? "bg-green-50" : ""}>
                    <td className="border px-3 py-2 text-center text-sm text-gray-700">{row.year}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={row.salvageValue}
                        onChange={(e) => updateRowValue(index, "salvageValue", e.target.value)}
                        className="w-full px-2 py-1 exp-input text-center text-sm"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={row.omCost}
                        onChange={(e) => updateRowValue(index, "omCost", e.target.value)}
                        className="w-full px-2 py-1 exp-input text-center text-sm"
                      />
                    </td>
                    <td className="border px-3 py-2 text-center text-sm text-gray-600">{row.cr}</td>
                    <td className="border px-3 py-2 text-center text-sm text-gray-600">{row.pwOm}</td>
                    <td className="border px-3 py-2 text-center text-sm text-gray-600">{row.sumOm}</td>
                    <td className="border px-3 py-2 text-center text-sm text-gray-600">{row.aeOm}</td>
                    <td className="border px-3 py-2 text-center text-sm font-bold text-gray-800 bg-green-50">
                      {row.totalAe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatisticCard
            title="年最低成本"
            value={minTotalAe.toFixed(0)}
            prefix="¥"
            valueColor="text-green-600"
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="产品生命周期"
            value={optimalYear}
            suffix="年"
            valueColor="text-green-600"
            className="border border-gray-200 rounded-lg p-6"
          />
        </div>

        {/* 辅助系数表 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">附：年金现值系数(P/A,i,n)表</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">期数</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">6%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">7%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">8%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">9%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">10%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">11%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">12%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">13%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">14%</th>
                  <th className="border px-2 py-1 text-center font-medium text-gray-700">15%</th>
                </tr>
              </thead>
              <tbody>
                {paTableData.map((row) => (
                  <tr key={row.year}>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.year}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r6}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r7}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r8}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r9}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r10}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r11}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r12}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r13}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r14}</td>
                    <td className="border px-2 py-1 text-center text-gray-600">{row.r15}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 实验结果 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">四、实验结果</h2>
          <p className="text-gray-600 mb-2">年最低成本: {minTotalAe.toFixed(0)} 元</p>
          <p className="text-gray-600">产品生命周期: {optimalYear} 年</p>
        </div>

        {/* 实验心得 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">五、实验心得</h2>
          <textarea
            placeholder="请输入实验心得..."
            className="w-full px-3 py-2 exp-textarea"
            rows={6}
          />
        </div>
      </div>
    </div>
  );
}
