import { useMemo, useState } from "react";
import { markii, type MarkIIEntity, type MarkIIResult } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";

export default function MarkiiPage() {
  const [entities, setEntities] = useState<MarkIIEntity[]>([
    { id: "1", name: "用户注册", inputDataElements: 8, entityTypeReferences: 2, outputDataElements: 6 },
    { id: "2", name: "订单查询", inputDataElements: 4, entityTypeReferences: 3, outputDataElements: 7 },
    { id: "3", name: "支付确认", inputDataElements: 6, entityTypeReferences: 2, outputDataElements: 5 },
  ]);

  const result: MarkIIResult = useMemo(() => markii(entities), [entities]);

  const addEntity = () => {
    const newId = (entities.length + 1).toString();
    setEntities([
      ...entities,
      { id: newId, name: "新交易", inputDataElements: 1, entityTypeReferences: 1, outputDataElements: 1 },
    ]);
  };

  const removeEntity = (id: string) => {
    setEntities(entities.filter((e) => e.id !== id));
  };

  const updateEntity = (id: string, updates: Partial<MarkIIEntity>) => {
    setEntities(entities.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const chartData = useMemo(
    () =>
      result.details.map((d, idx) => ({
        name: d.name || `交易${idx + 1}`,
        value: d.fp,
      })),
    [result]
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">MARK II 功能点度量</h1>
          <ExportPDF targetId="experiment-content" filename="MARKII功能点度量.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            本页按 MARK II 逻辑交易口径计算未调整功能点，输入字段为交易的数据元素与实体类型引用数。
          </p>
          <FormulaBlock
            title="MARK II 公式"
            formula={String.raw`FP_{txn}=0.58 \times DET_{in}+1.66 \times FTR+0.26 \times DET_{out}`}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">逻辑交易配置</h2>
            <button
              onClick={addEntity}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              添加交易
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">交易名称</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">输入数据元素 DETin</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">实体类型引用 FTR</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">输出数据元素 DETout</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((entity) => (
                  <tr key={entity.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={entity.name}
                        onChange={(e) => updateEntity(entity.id, { name: e.target.value })}
                        className="w-full px-3 py-2 exp-input"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={0}
                        value={entity.inputDataElements}
                        onChange={(e) =>
                          updateEntity(entity.id, { inputDataElements: Number(e.target.value) })
                        }
                        className="w-28 px-3 py-2 exp-input"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={0}
                        value={entity.entityTypeReferences}
                        onChange={(e) =>
                          updateEntity(entity.id, { entityTypeReferences: Number(e.target.value) })
                        }
                        className="w-28 px-3 py-2 exp-input"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={0}
                        value={entity.outputDataElements}
                        onChange={(e) =>
                          updateEntity(entity.id, { outputDataElements: Number(e.target.value) })
                        }
                        className="w-28 px-3 py-2 exp-input"
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <StatisticCard
            title="逻辑交易数"
            value={result.transactionCount}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="输入 DET 总数"
            value={result.totalInputDataElements}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="实体引用 FTR 总数"
            value={result.totalEntityTypeReferences}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="输出 DET 总数"
            value={result.totalOutputDataElements}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="未调整功能点 UFP"
            value={result.unadjustedFP}
            valueColor="text-gray-800"
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="总功能点 FP"
            value={result.totalFP}
            valueColor="text-green-600"
            className="border border-gray-200 rounded-lg p-6"
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">详细计算</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">交易</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">DETin</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">FTR</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">DETout</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">FP</th>
                </tr>
              </thead>
              <tbody>
                {result.details.map((detail) => (
                  <tr key={detail.id} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-gray-800">{detail.name}</td>
                    <td className="px-4 py-2 text-gray-800">{detail.inputDataElements}</td>
                    <td className="px-4 py-2 text-gray-800">{detail.entityTypeReferences}</td>
                    <td className="px-4 py-2 text-gray-800">{detail.outputDataElements}</td>
                    <td className="px-4 py-2 text-gray-800">{detail.fp.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">各交易功能点分布</h2>
          <LineChart
            title=""
            xAxisData={chartData.map((d) => d.name)}
            series={[{ name: "FP", data: chartData.map((d) => d.value), color: "#2563eb" }]}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
