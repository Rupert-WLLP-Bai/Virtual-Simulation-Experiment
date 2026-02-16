import { useState, useMemo } from "react";
import { StatisticCard } from "@/components/ui/statistic-card";
import { FormulaBlock } from "@/components/ui/formula";
import { ExportPDF } from "@/components/ui/export-pdf";

// 自有工具类型
interface OwnTool {
  depreciation: number;      // 固定资产应计折旧额
  usefulLife: number;       // 固定资产预计使用年限
  maintenanceCosts: number; // 维护费用
  actualUsageTime: number; // 工具实际使用时间（天）
}

// 租借工具类型
interface RentTool {
  rentExpense: number;  // 租赁费用（元/月）
  termOfLease: number; // 租赁期限（月）
}

export default function TestcostPage() {
  // 步骤1：软件测试工作量
  const [TW, setTW] = useState<number>(50); // 软件测试工作量（人日）

  // 步骤2：调整因子
  const [adjustmentFactors, setAdjustmentFactors] = useState({
    C: 1.0,   // 软件复杂性调整因子 (1.0~1.5)
    I: 1.0,   // 软件完整性调整因子 (1.0~1.8)
    R: 1.0,   // 测试风险调整因子 (1.0~1.5)
    U: 1.0,   // 加急测试调整因子 (1.0~3.0)
    X: 1.0,   // 现场测试调整因子 (1.0~1.3)
    A: 1.0,   // 评测机构资质调整因子 (1.0~1.2)
    Tr: 0.6,  // 回归测试调整因子 (0.6~0.8)
    n: 1,     // 回归测试次数
  });

  // 步骤3：工作量单价
  const [S, setS] = useState<number>(500); // 工作量单价（元/人日）

  // 步骤4：工具成本
  const [ownTools, setOwnTools] = useState<OwnTool[]>([
    { depreciation: 50000, usefulLife: 5, maintenanceCosts: 5000, actualUsageTime: 20 },
  ]);
  const [rentTools, setRentTools] = useState<RentTool[]>([
    { rentExpense: 1000, termOfLease: 3 },
  ]);

  // 步骤5：测试环境成本
  const [EC, setEC] = useState<number>(5000); // 测试环境成本

  // 步骤6：间接成本
  const [IDC, setIDC] = useState<number>(3000); // 间接成本

  // 计算未调整的软件测试人工工作量 UW = TW + SR + DR
  const UW = useMemo(() => {
    const SR = TW * 0.1; // 产品说明评审工作量
    const DR = TW * 0.2; // 用户文档集评审工作量
    return TW + SR + DR;
  }, [TW]);

  // 计算软件测试成本调整因子 DF = C * I * R * U * X * A * (1 + n * Tr)
  const DF = useMemo(() => {
    const { C, I, R, U, X, A, Tr, n } = adjustmentFactors;
    return C * I * R * U * X * A * (1 + n * Tr);
  }, [adjustmentFactors]);

  // 计算测试人工成本 LC = UW * DF * S
  const LC = useMemo(() => {
    return UW * DF * S;
  }, [UW, DF, S]);

  // 计算自有工具成本 OT
  const OT = useMemo(() => {
    return ownTools.reduce((sum, tool) => {
      if (tool.usefulLife > 0 && tool.actualUsageTime > 0) {
        const annualDepreciation = tool.depreciation / tool.usefulLife;
        const dailyCost = (annualDepreciation + tool.maintenanceCosts) / 200;
        return sum + dailyCost * tool.actualUsageTime;
      }
      return sum;
    }, 0);
  }, [ownTools]);

  // 计算租借工具成本 RT
  const RT = useMemo(() => {
    return rentTools.reduce((sum, tool) => {
      return sum + tool.rentExpense * tool.termOfLease;
    }, 0);
  }, [rentTools]);

  // 计算测试工具成本 IC = OT + RT
  const IC = useMemo(() => {
    return OT + RT;
  }, [OT, RT]);

  // 计算直接成本 DC = LC + EC + IC
  const DC = useMemo(() => {
    return LC + EC + IC;
  }, [LC, EC, IC]);

  // 计算软件测试成本 STC = DC + IDC
  const STC = useMemo(() => {
    return DC + IDC;
  }, [DC, IDC]);

  // 添加自有工具
  const addOwnTool = () => {
    setOwnTools([
      ...ownTools,
      { depreciation: 0, usefulLife: 1, maintenanceCosts: 0, actualUsageTime: 1 },
    ]);
  };

  // 删除自有工具
  const removeOwnTool = (index: number) => {
    setOwnTools(ownTools.filter((_, i) => i !== index));
  };

  // 更新自有工具
  const updateOwnTool = (index: number, field: keyof OwnTool, value: number) => {
    const newTools = [...ownTools];
    newTools[index] = { ...newTools[index], [field]: value } as OwnTool;
    setOwnTools(newTools);
  };

  // 添加租借工具
  const addRentTool = () => {
    setRentTools([...rentTools, { rentExpense: 0, termOfLease: 1 }]);
  };

  // 删除租借工具
  const removeRentTool = (index: number) => {
    setRentTools(rentTools.filter((_, i) => i !== index));
  };

  // 更新租借工具
  const updateRentTool = (index: number, field: keyof RentTool, value: number) => {
    const newTools = [...rentTools];
    newTools[index] = { ...newTools[index], [field]: value } as RentTool;
    setRentTools(newTools);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">软件测试成本度量</h1>
          <ExportPDF targetId="experiment-content" filename="软件测试成本度量.pdf" />
        </div>

        {/* 国标说明 */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
          <p className="text-sm text-gray-600">
            <strong>依据标准：</strong>GB/T 32911-2016《软件测试成本度量规范》
          </p>
          <p className="text-sm text-gray-500 mt-1">
            本实验按照国家标准规定的软件测试成本度量方法进行计算，包括工作量估算、调整因子应用和成本汇总。
          </p>
        </div>

        {/* 步骤1：软件测试的人工成本工作量计算 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">步骤一：软件测试的人工成本工作量计算</h2>

          <FormulaBlock
            formula={String.raw`UW = TW + SR + DR = TW + TW \times 10\% + TW \times 20\%`}
            title="公式 (1)：未调整的软件测试人工工作量"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                软件测试工作量 TW（人日）
              </label>
              <input
                type="number"
                min={0}
                value={TW}
                onChange={(e) => setTW(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品说明评审工作量 SR（人日）
              </label>
              <input
                type="number"
                disabled
                value={(TW * 0.1).toFixed(2)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户文档集评审工作量 DR（人日）
              </label>
              <input
                type="number"
                disabled
                value={(TW * 0.2).toFixed(2)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 break-all">
              <strong>计算结果：</strong>UW = {TW} + {TW} × 10% + {TW} × 20% = <span className="font-bold text-gray-900">{UW.toFixed(2)}</span> 人日
            </p>
          </div>
        </div>

        {/* 步骤2：软件测试成本调整因子计算 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">步骤二：软件测试成本调整因子计算</h2>

          <FormulaBlock
            formula={String.raw`DF = C \times I \times R \times U \times X \times A \times (1 + n \times Tr)`}
            title="公式 (2)：软件测试成本调整因子"
          />

          <div className="overflow-x-auto">
            <table className="w-full mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">调整因子</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">参数</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">取值范围</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">当前值</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-700">软件复杂性调整因子</td>
                  <td className="px-4 py-2 text-gray-500">C</td>
                  <td className="px-4 py-2 text-gray-500">1.0 ~ 1.5</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1.0}
                      max={1.5}
                      step={0.1}
                      value={adjustmentFactors.C}
                      onChange={(e) => setAdjustmentFactors({ ...adjustmentFactors, C: Number(e.target.value) })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-700">软件完整性调整因子</td>
                  <td className="px-4 py-2 text-gray-500">I</td>
                  <td className="px-4 py-2 text-gray-500">1.0 ~ 1.8</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1.0}
                      max={1.8}
                      step={0.1}
                      value={adjustmentFactors.I}
                      onChange={(e) => setAdjustmentFactors({ ...adjustmentFactors, I: Number(e.target.value) })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-700">测试风险调整因子</td>
                  <td className="px-4 py-2 text-gray-500">R</td>
                  <td className="px-4 py-2 text-gray-500">1.0 ~ 1.5</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1.0}
                      max={1.5}
                      step={0.1}
                      value={adjustmentFactors.R}
                      onChange={(e) => setAdjustmentFactors({ ...adjustmentFactors, R: Number(e.target.value) })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-700">加急测试调整因子</td>
                  <td className="px-4 py-2 text-gray-500">U</td>
                  <td className="px-4 py-2 text-gray-500">1.0 ~ 3.0</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1.0}
                      max={3.0}
                      step={0.1}
                      value={adjustmentFactors.U}
                      onChange={(e) => setAdjustmentFactors({ ...adjustmentFactors, U: Number(e.target.value) })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-700">现场测试调整因子</td>
                  <td className="px-4 py-2 text-gray-500">X</td>
                  <td className="px-4 py-2 text-gray-500">1.0 ~ 1.3</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1.0}
                      max={1.3}
                      step={0.1}
                      value={adjustmentFactors.X}
                      onChange={(e) => setAdjustmentFactors({ ...adjustmentFactors, X: Number(e.target.value) })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-700">评测机构资质调整因子</td>
                  <td className="px-4 py-2 text-gray-500">A</td>
                  <td className="px-4 py-2 text-gray-500">1.0 ~ 1.2</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1.0}
                      max={1.2}
                      step={0.1}
                      value={adjustmentFactors.A}
                      onChange={(e) => setAdjustmentFactors({ ...adjustmentFactors, A: Number(e.target.value) })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-700">回归测试调整因子</td>
                  <td className="px-4 py-2 text-gray-500">Tr</td>
                  <td className="px-4 py-2 text-gray-500">0.6 ~ 0.8</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0.6}
                      max={0.8}
                      step={0.1}
                      value={adjustmentFactors.Tr}
                      onChange={(e) => setAdjustmentFactors({ ...adjustmentFactors, Tr: Number(e.target.value) })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-700">回归测试次数</td>
                  <td className="px-4 py-2 text-gray-500">n</td>
                  <td className="px-4 py-2 text-gray-500">{"\u003E="} 0</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={adjustmentFactors.n}
                      onChange={(e) => setAdjustmentFactors({ ...adjustmentFactors, n: Number(e.target.value) })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 break-all">
              <strong>计算结果：</strong>DF = {adjustmentFactors.C} × {adjustmentFactors.I} × {adjustmentFactors.R} × {adjustmentFactors.U} × {adjustmentFactors.X} × {adjustmentFactors.A} × (1 + {adjustmentFactors.n} × {adjustmentFactors.Tr}) = <span className="font-bold text-gray-900">{DF.toFixed(4)}</span>
            </p>
          </div>
        </div>

        {/* 步骤3：软件测试的人工成本计算 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">步骤三：软件测试的人工成本计算</h2>

          <FormulaBlock
            formula={String.raw`LC = UW \times DF \times S`}
            title="公式 (3)：测试人工成本"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                未调整工作量 UW（人日）
              </label>
              <input
                type="number"
                disabled
                value={UW.toFixed(2)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                调整因子 DF
              </label>
              <input
                type="number"
                disabled
                value={DF.toFixed(4)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                工作量单价 S（元/人日）
              </label>
              <input
                type="number"
                min={0}
                value={S}
                onChange={(e) => setS(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 break-all">
              <strong>计算结果：</strong>LC = {UW.toFixed(2)} × {DF.toFixed(4)} × {S} = <span className="font-bold text-gray-900">¥{LC.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* 步骤4：软件测试的工具成本计算 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">步骤四：软件测试的工具成本计算</h2>

          <FormulaBlock
            formula="IC = OT + RT"
            title="公式 (4)：测试工具成本"
          />

          {/* 自有工具 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium text-gray-700">自有工具成本 (OT)</h3>
              <button
                onClick={addOwnTool}
                className="px-3 py-1 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                + 添加
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              计算公式：OT = (固定资产应计折旧额 / 预计使用年限 + 维护费用) / 200 × 实际使用时间
            </p>

            {ownTools.map((tool, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-2">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">应计折旧额（元）</label>
                    <input
                      type="number"
                      min={0}
                      value={tool.depreciation}
                      onChange={(e) => updateOwnTool(index, "depreciation", Number(e.target.value))}
                      className="w-full px-2 py-1 exp-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">预计使用年限</label>
                    <input
                      type="number"
                      min={1}
                      value={tool.usefulLife}
                      onChange={(e) => updateOwnTool(index, "usefulLife", Number(e.target.value))}
                      className="w-full px-2 py-1 exp-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">维护费用（元）</label>
                    <input
                      type="number"
                      min={0}
                      value={tool.maintenanceCosts}
                      onChange={(e) => updateOwnTool(index, "maintenanceCosts", Number(e.target.value))}
                      className="w-full px-2 py-1 exp-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">使用时间（天）</label>
                    <input
                      type="number"
                      min={0}
                      value={tool.actualUsageTime}
                      onChange={(e) => updateOwnTool(index, "actualUsageTime", Number(e.target.value))}
                      className="w-full px-2 py-1 exp-input text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removeOwnTool(index)}
                      className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                      disabled={ownTools.length === 1}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-right text-gray-700 mt-2">自有工具成本合计：<strong>¥{OT.toFixed(2)}</strong></p>
          </div>

          {/* 租借工具 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium text-gray-700">租借工具成本 (RT)</h3>
              <button
                onClick={addRentTool}
                className="px-3 py-1 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                + 添加
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">计算公式：RT = 租赁费用 × 租赁期限</p>

            {rentTools.map((tool, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">租赁费用（元/月）</label>
                    <input
                      type="number"
                      min={0}
                      value={tool.rentExpense}
                      onChange={(e) => updateRentTool(index, "rentExpense", Number(e.target.value))}
                      className="w-full px-2 py-1 exp-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">租赁期限（月）</label>
                    <input
                      type="number"
                      min={0}
                      value={tool.termOfLease}
                      onChange={(e) => updateRentTool(index, "termOfLease", Number(e.target.value))}
                      className="w-full px-2 py-1 exp-input text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removeRentTool(index)}
                      className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                      disabled={rentTools.length === 1}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-right text-gray-700 mt-2">租借工具成本合计：<strong>¥{RT.toFixed(2)}</strong></p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 break-all">
              <strong>计算结果：</strong>IC = OT + RT = {OT.toFixed(2)} + {RT.toFixed(2)} = <span className="font-bold text-gray-900">¥{IC.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* 步骤5：软件测试直接成本计算 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">步骤五：软件测试直接成本计算</h2>

          <FormulaBlock
            formula="DC = LC + EC + IC"
            title="公式 (5)：直接成本"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                测试人工成本 LC（元）
              </label>
              <input
                type="number"
                disabled
                value={LC.toFixed(2)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                测试环境成本 EC（元）
              </label>
              <input
                type="number"
                min={0}
                value={EC}
                onChange={(e) => setEC(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                测试工具成本 IC（元）
              </label>
              <input
                type="number"
                disabled
                value={IC.toFixed(2)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 break-all">
              <strong>计算结果：</strong>DC = {LC.toFixed(2)} + {EC} + {IC.toFixed(2)} = <span className="font-bold text-gray-900">¥{DC.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* 步骤6：软件测试成本计算 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">步骤六：软件测试成本计算</h2>

          <FormulaBlock
            formula="STC = DC + IDC"
            title="公式 (6)：软件测试总成本"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                直接成本 DC（元）
              </label>
              <input
                type="number"
                disabled
                value={DC.toFixed(2)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                间接成本 IDC（元）
              </label>
              <input
                type="number"
                min={0}
                value={IDC}
                onChange={(e) => setIDC(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 break-all">
              <strong>计算结果：</strong>STC = {DC.toFixed(2)} + {IDC} = <span className="font-bold text-gray-900">¥{STC.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* 统计结果汇总 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">成本汇总统计</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatisticCard
              title="人工成本 (LC)"
              value={LC.toFixed(2)}
              prefix="¥"
              valueColor="text-gray-800"
              className="border border-gray-200 rounded-lg p-4"
            />
            <StatisticCard
              title="环境成本 (EC)"
              value={EC.toFixed(2)}
              prefix="¥"
              valueColor="text-gray-600"
              className="border border-gray-200 rounded-lg p-4"
            />
            <StatisticCard
              title="工具成本 (IC)"
              value={IC.toFixed(2)}
              prefix="¥"
              valueColor="text-gray-600"
              className="border border-gray-200 rounded-lg p-4"
            />
            <StatisticCard
              title="间接成本 (IDC)"
              value={IDC.toFixed(2)}
              prefix="¥"
              valueColor="text-gray-600"
              className="border border-gray-200 rounded-lg p-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatisticCard
              title="直接成本 (DC)"
              value={DC.toFixed(2)}
              prefix="¥"
              valueColor="text-gray-800"
              className="border border-gray-200 rounded-lg p-4"
            />
            <StatisticCard
              title="软件测试总成本 (STC)"
              value={STC.toFixed(2)}
              prefix="¥"
              valueColor="text-gray-900"
              className="border-2 border-gray-800 rounded-lg p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
