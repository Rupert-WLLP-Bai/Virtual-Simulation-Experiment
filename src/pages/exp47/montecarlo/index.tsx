import { useState, useMemo } from "react";
import { monteCarlo, type MonteCarloInput, type MonteCarloResult } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";

export default function MonteCarloPage() {
  const [iterations, setIterations] = useState<number>(1000);
  const [variables, setVariables] = useState<MonteCarloInput["variables"]>([
    { name: "销量", distribution: "normal", params: { mean: 1000, std: 100 } },
    { name: "单价", distribution: "uniform", params: { min: 45, max: 55 } },
    { name: "单位成本", distribution: "triangular", params: { min: 25, max: 35, mode: 30 } },
  ]);

  // 利润计算公式: 利润 = 销量 * (单价 - 单位成本) - 固定成本
  const formula = (values: Record<string, number>): number => {
    const sales = values["销量"];
    const price = values["单价"];
    const unitCost = values["单位成本"];
    const fixedCost = 10000; // 固定成本
    return sales * (price - unitCost) - fixedCost;
  };

  const input: MonteCarloInput = useMemo(
    () => ({ variables, iterations, formula }),
    [variables, iterations]
  );

  const result: MonteCarloResult = useMemo(() => monteCarlo(input), [input]);

  const updateVariable = (index: number, updates: Partial<MonteCarloInput["variables"][0]>) => {
    const newVariables = [...variables];
    newVariables[index] = { ...newVariables[index], ...updates };
    setVariables(newVariables);
  };

  const updateParams = (index: number, paramKey: string, value: number) => {
    const newVariables = [...variables];
    newVariables[index].params = { ...newVariables[index].params, [paramKey]: value };
    setVariables(newVariables);
  };

  const chartData = useMemo(() => {
    if (!result.samples || result.samples.length === 0) return { labels: [] as string[], bins: [] as number[] };
    // 采样用于显示直方图数据
    const binCount = 20;
    const min = result.min;
    const max = result.max;
    const binWidth = (max - min) / binCount;
    const bins = Array(binCount).fill(0);
    const labels: string[] = [];

    result.samples.forEach((v) => {
      const binIndex = Math.min(Math.floor((v - min) / binWidth), binCount - 1);
      bins[binIndex]++;
    });

    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth;
      labels.push(Math.round(binStart).toString());
    }

    return { labels, bins };
  }, [result]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">蒙特卡洛模拟</h1>
          <ExportPDF targetId="experiment-content" filename="蒙特卡洛模拟.pdf" />
        </div>

        {/* 参数配置 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">模拟参数配置</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模拟次数</label>
              <input
                type="number"
                min={100}
                max={10000}
                value={iterations}
                onChange={(e) => setIterations(Number(e.target.value))}
                className="w-full px-3 py-2 exp-input"
              />
            </div>
          </div>

          {/* 变量配置 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">变量定义（利润 = 销量 * (单价 - 单位成本) - 10000）</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">变量名称</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">分布类型</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">参数</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((variable, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => updateVariable(index, { name: e.target.value })}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={variable.distribution}
                      onChange={(e) =>
                        updateVariable(index, { distribution: e.target.value as MonteCarloInput["variables"][0]["distribution"] })
                      }
                      className="w-full px-3 py-2 exp-select"
                    >
                      <option value="normal">正态分布</option>
                      <option value="uniform">均匀分布</option>
                      <option value="triangular">三角分布</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {variable.distribution === "normal" && (
                        <>
                          <input
                            type="number"
                            placeholder="均值"
                            value={variable.params.mean || 0}
                            onChange={(e) => updateParams(index, "mean", Number(e.target.value))}
                            className="w-20 px-3 py-2 exp-input"
                          />
                          <input
                            type="number"
                            placeholder="标准差"
                            value={variable.params.std || 0}
                            onChange={(e) => updateParams(index, "std", Number(e.target.value))}
                            className="w-20 px-3 py-2 exp-input"
                          />
                        </>
                      )}
                      {variable.distribution === "uniform" && (
                        <>
                          <input
                            type="number"
                            placeholder="最小值"
                            value={variable.params.min || 0}
                            onChange={(e) => updateParams(index, "min", Number(e.target.value))}
                            className="w-20 px-3 py-2 exp-input"
                          />
                          <input
                            type="number"
                            placeholder="最大值"
                            value={variable.params.max || 0}
                            onChange={(e) => updateParams(index, "max", Number(e.target.value))}
                            className="w-20 px-3 py-2 exp-input"
                          />
                        </>
                      )}
                      {variable.distribution === "triangular" && (
                        <>
                          <input
                            type="number"
                            placeholder="最小值"
                            value={variable.params.min || 0}
                            onChange={(e) => updateParams(index, "min", Number(e.target.value))}
                            className="w-16 px-3 py-2 exp-input"
                          />
                          <input
                            type="number"
                            placeholder="众数"
                            value={variable.params.mode || 0}
                            onChange={(e) => updateParams(index, "mode", Number(e.target.value))}
                            className="w-16 px-3 py-2 exp-input"
                          />
                          <input
                            type="number"
                            placeholder="最大值"
                            value={variable.params.max || 0}
                            onChange={(e) => updateParams(index, "max", Number(e.target.value))}
                            className="w-16 px-3 py-2 exp-input"
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="均值" value={result.mean} prefix="¥" valueColor="text-gray-800" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="中位数" value={result.median} prefix="¥" valueColor="text-purple-600" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="标准差" value={result.std} valueColor="text-orange-600" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard
            title="盈利概率"
            value={result.probabilityPositive}
            suffix="%"
            valueColor={result.probabilityPositive >= 50 ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="最小值" value={result.min} prefix="¥" valueColor="text-gray-500" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="最大值" value={result.max} prefix="¥" valueColor="text-gray-500" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="5%分位数" value={result.p5} prefix="¥" valueColor="text-gray-500" className="border border-gray-200 rounded-lg p-6" />
          <StatisticCard title="95%分位数" value={result.p95} prefix="¥" valueColor="text-gray-500" className="border border-gray-200 rounded-lg p-6" />
        </div>

        {/* 图表 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">利润分布直方图</h2>
          {chartData.labels && (
            <LineChart
              title=""
              xAxisData={chartData.labels}
              series={[{ name: "频次", data: chartData.bins, color: "#6366f1" }]}
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
}
