import { useState, useMemo } from "react";
import { cosmic, type CosmicEntry, type CosmicResult } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";

export default function CosmicPage() {
  const [entries, setEntries] = useState<CosmicEntry[]>([
    { id: "1", name: "用户登录", type: "Entry", objects: ["用户名", "密码"] },
    { id: "2", name: "显示订单列表", type: "Read", objects: ["订单数据"] },
    { id: "3", name: "保存订单", type: "Write", objects: ["订单数据", "订单明细"] },
    { id: "4", name: "导出报表", type: "Exit", objects: ["报表数据"] },
  ]);

  const result: CosmicResult = useMemo(() => cosmic(entries), [entries]);

  const addEntry = () => {
    const newId = (entries.length + 1).toString();
    setEntries([...entries, { id: newId, name: "新功能", type: "Entry", objects: ["数据项"] }]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<CosmicEntry>) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const chartData = useMemo(() => {
    return [
      { name: "Entry", value: result.entry },
      { name: "Exit", value: result.exit },
      { name: "Read", value: result.read },
      { name: "Write", value: result.write },
    ];
  }, [result]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">COSMIC 功能点度量</h1>
          <ExportPDF targetId="experiment-content" filename="COSMIC功能点度量.pdf" />
        </div>

        {/* 输入参数 */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">功能项配置</h2>
            <button
              onClick={addEntry}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              添加功能项
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">功能名称</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">类型</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">数据项数量</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={entry.name}
                        onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                        className="w-full px-3 py-2 exp-select"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={entry.type}
                        onChange={(e) => updateEntry(entry.id, { type: e.target.value as CosmicEntry["type"] })}
                        className="w-full px-3 py-2 exp-select"
                      >
                        <option value="Entry">Entry (输入)</option>
                        <option value="Exit">Exit (输出)</option>
                        <option value="Read">Read (读取)</option>
                        <option value="Write">Write (写入)</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={1}
                        value={entry.objects.length}
                        onChange={(e) => {
                          const count = Number(e.target.value);
                          const newObjects = Array(count).fill("数据项");
                          updateEntry(entry.id, { objects: newObjects });
                        }}
                        className="w-20 px-3 py-2 exp-select"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <StatisticCard title="Entry (输入)" value={result.entry} valueColor="text-blue-600" />
          <StatisticCard title="Exit (输出)" value={result.exit} valueColor="text-green-600" />
          <StatisticCard title="Read (读取)" value={result.read} valueColor="text-purple-600" />
          <StatisticCard title="Write (写入)" value={result.write} valueColor="text-orange-600" />
          <StatisticCard title="总功能点数" value={result.total} valueColor="text-indigo-600" />
          <StatisticCard title="CFP" value={result.fp} valueColor="text-teal-600" />
        </div>

        {/* 图表 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">功能类型分布</h2>
          <LineChart
            title=""
            xAxisData={chartData.map((d) => d.name)}
            series={[{ name: "功能点", data: chartData.map((d) => d.value), color: "#3b82f6" }]}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
