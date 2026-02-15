import { useState, useMemo } from "react";
import { markii, type MarkIIEntity, type MarkIIResult } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";

export default function MarkiiPage() {
  const [entities, setEntities] = useState<MarkIIEntity[]>([
    { id: "1", name: "用户数据", type: "ILF", complexity: "low", ret: 1, det: 5 },
    { id: "2", name: "订单查询", type: "EQ", complexity: "medium", ret: 1, det: 8 },
    { id: "3", name: "数据录入", type: "EI", complexity: "high", ret: 2, det: 15 },
  ]);

  const result: MarkIIResult = useMemo(() => markii(entities), [entities]);

  const addEntity = () => {
    const newId = (entities.length + 1).toString();
    setEntities([
      ...entities,
      { id: newId, name: "新功能", type: "EI", complexity: "low", ret: 1, det: 3 },
    ]);
  };

  const removeEntity = (id: string) => {
    setEntities(entities.filter((e) => e.id !== id));
  };

  const updateEntity = (id: string, updates: Partial<MarkIIEntity>) => {
    setEntities(entities.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const chartData = useMemo(() => {
    const typeMap = new Map<string, number>();
    result.details.forEach((d) => {
      typeMap.set(d.type, (typeMap.get(d.type) || 0) + d.fp);
    });
    return Array.from(typeMap.entries()).map(([name, value]) => ({ name, value }));
  }, [result]);

  return (
    <div className="min-h-screen bg-gray-50 p-6" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">MARK II 功能点度量</h1>
          <ExportPDF targetId="experiment-content" filename="MARKII功能点度量.pdf" />
        </div>

        {/* 输入参数 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">功能项配置</h2>
            <button
              onClick={addEntity}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">复杂度</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">RET</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">DET</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((entity) => (
                  <tr key={entity.id} className="border-t">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={entity.name}
                        onChange={(e) => updateEntity(entity.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={entity.type}
                        onChange={(e) =>
                          updateEntity(entity.id, { type: e.target.value as MarkIIEntity["type"] })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="ILF">ILF (内部逻辑文件)</option>
                        <option value="EIF">EIF (外部接口文件)</option>
                        <option value="EI">EI (外部输入)</option>
                        <option value="EO">EO (外部输出)</option>
                        <option value="EQ">EQ (外部查询)</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={entity.complexity}
                        onChange={(e) =>
                          updateEntity(entity.id, { complexity: e.target.value as MarkIIEntity["complexity"] })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="low">低</option>
                        <option value="medium">中</option>
                        <option value="high">高</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={1}
                        value={entity.ret}
                        onChange={(e) => updateEntity(entity.id, { ret: Number(e.target.value) })}
                        className="w-20 px-3 py-2 border rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={1}
                        value={entity.det}
                        onChange={(e) => updateEntity(entity.id, { det: Number(e.target.value) })}
                        className="w-20 px-3 py-2 border rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => removeEntity(entity.id)} className="text-red-600 hover:text-red-800">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard
            title="未调整功能点"
            value={result.unadjustedFP}
            valueColor="text-blue-600"
          />
          <StatisticCard
            title="总功能点"
            value={result.totalFP}
            valueColor="text-green-600"
          />
        </div>

        {/* 详细结果 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">详细计算</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">类型</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">数量</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">权重</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">功能点</th>
              </tr>
            </thead>
            <tbody>
              {result.details.map((detail, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{detail.type}</td>
                  <td className="px-4 py-2">{detail.count}</td>
                  <td className="px-4 py-2">{detail.weight}</td>
                  <td className="px-4 py-2">{detail.fp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 图表 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">功能类型分布</h2>
          <LineChart
            title=""
            xAxisData={chartData.map((d) => d.name)}
            series={[
              { name: "功能点数量", data: chartData.map((d) => d.value), color: "#6366f1" },
            ]}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
