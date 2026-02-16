import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";

type FunctionType = "ILF" | "EIF" | "EI" | "EO" | "EQ";
type Complexity = "low" | "medium" | "high";

interface WeightSet {
  low: number;
  medium: number;
  high: number;
}

type WeightMap = Record<FunctionType, WeightSet>;

interface FunctionPointCalculatorProps {
  title: string;
  methodName: string;
  weights: WeightMap;
  exportFilename: string;
}

interface CountRow {
  low: number;
  medium: number;
  high: number;
}

const FUNCTION_ITEMS: { key: FunctionType; label: string }[] = [
  { key: "ILF", label: "ILF（内部逻辑文件）" },
  { key: "EIF", label: "EIF（外部接口文件）" },
  { key: "EI", label: "EI（外部输入）" },
  { key: "EO", label: "EO（外部输出）" },
  { key: "EQ", label: "EQ（外部查询）" },
];

export function FunctionPointCalculator({
  title,
  methodName,
  weights,
  exportFilename,
}: FunctionPointCalculatorProps) {
  const [counts, setCounts] = useState<Record<FunctionType, CountRow>>({
    ILF: { low: 1, medium: 1, high: 0 },
    EIF: { low: 1, medium: 0, high: 0 },
    EI: { low: 2, medium: 1, high: 0 },
    EO: { low: 1, medium: 1, high: 0 },
    EQ: { low: 1, medium: 0, high: 0 },
  });
  const [gscTotal, setGscTotal] = useState(35);

  const details = useMemo(() => {
    return FUNCTION_ITEMS.map((item) => {
      const row = counts[item.key];
      const w = weights[item.key];
      const value = row.low * w.low + row.medium * w.medium + row.high * w.high;
      return {
        key: item.key,
        label: item.label,
        low: row.low,
        medium: row.medium,
        high: row.high,
        weightLow: w.low,
        weightMedium: w.medium,
        weightHigh: w.high,
        ufp: value,
      };
    });
  }, [counts, weights]);

  const ufp = useMemo(() => details.reduce((sum, d) => sum + d.ufp, 0), [details]);
  const vaf = useMemo(() => {
    const safe = Math.max(0, Math.min(70, gscTotal));
    return 0.65 + 0.01 * safe;
  }, [gscTotal]);
  const fp = useMemo(() => Math.round(ufp * vaf * 100) / 100, [ufp, vaf]);

  const chartData = useMemo(
    () => details.map((d) => ({ name: d.key, value: d.ufp })),
    [details]
  );

  const updateCount = (key: FunctionType, field: Complexity, value: number) => {
    setCounts((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: Math.max(0, Number.isFinite(value) ? value : 0),
      },
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <ExportPDF targetId="experiment-content" filename={exportFilename} />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">方法：{methodName}</p>
          <FormulaBlock
            formulas={[
              { label: "未调整功能点", formula: String.raw`UFP=\sum (Count_{i,j}\times Weight_{i,j})` },
              { label: "调整因子", formula: String.raw`VAF=0.65+0.01\times GSC` },
              { label: "调整后功能点", formula: String.raw`FP=UFP\times VAF` },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">功能点计数输入</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">功能类型</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">低复杂度数量</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">中复杂度数量</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">高复杂度数量</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">该类型 UFP</th>
                </tr>
              </thead>
              <tbody>
                {details.map((row) => (
                  <tr key={row.key} className="border-t border-gray-200">
                    <td className="px-3 py-2 text-sm text-gray-800">{row.label}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={row.low}
                        onChange={(e) => updateCount(row.key, "low", Number(e.target.value))}
                        className="w-28 px-2 py-1 exp-input"
                      />
                      <span className="ml-2 text-xs text-gray-500">权重 {row.weightLow}</span>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={row.medium}
                        onChange={(e) => updateCount(row.key, "medium", Number(e.target.value))}
                        className="w-28 px-2 py-1 exp-input"
                      />
                      <span className="ml-2 text-xs text-gray-500">权重 {row.weightMedium}</span>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={row.high}
                        onChange={(e) => updateCount(row.key, "high", Number(e.target.value))}
                        className="w-28 px-2 py-1 exp-input"
                      />
                      <span className="ml-2 text-xs text-gray-500">权重 {row.weightHigh}</span>
                    </td>
                    <td className="px-3 py-2 text-sm font-semibold text-gray-800">{row.ufp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GSC 总分（0~70）
            </label>
            <input
              type="number"
              min={0}
              max={70}
              value={gscTotal}
              onChange={(e) => setGscTotal(Number(e.target.value))}
              className="w-32 px-3 py-2 exp-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard
            title="未调整功能点 UFP"
            value={ufp}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="调整因子 VAF"
            value={vaf.toFixed(2)}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="调整后功能点 FP"
            value={fp}
            valueColor="text-green-600"
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="计算说明"
            value={`${ufp} × ${vaf.toFixed(2)}`}
            className="border border-gray-200 rounded-lg p-6"
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">各类型 UFP 分布</h2>
          <LineChart
            title=""
            xAxisData={chartData.map((d) => d.name)}
            series={[{ name: "UFP", data: chartData.map((d) => d.value), color: "#2563eb" }]}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}

export type { WeightMap };
