import { useState, useMemo } from "react";
import { npv, irr, dpp, isFeasible } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { FormulaBlock } from "@/components/ui/formula";

export default function JinxianzhiPage() {
  const [cashflows, setCashflows] = useState([-10000, 3000, 4000, 5000, 2000]);
  const [rate, setRate] = useState(10);

  const result = useMemo(() => {
    const r = rate / 100;
    return {
      npv: npv(cashflows, r),
      irr: irr(cashflows) || 0,
      dpp: dpp(cashflows, r) || 0,
      feasible: isFeasible(npv(cashflows, r)),
    };
  }, [cashflows, rate]);

  const discountData = useMemo(() => {
    return cashflows.map((cf, i) => ({
      name: `第${i}年`,
      value: cf / Math.pow(1 + rate / 100, i),
    }));
  }, [cashflows, rate]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">NPV/IRR 投资评价</h1>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">现金流输入</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">折现率 (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-32 px-3 py-2 exp-input"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cashflows.map((cf, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-1">第{i}年</label>
                <input
                  type="number"
                  value={cf}
                  onChange={(e) => {
                    const newCf = [...cashflows];
                    newCf[i] = Number(e.target.value);
                    setCashflows(newCf);
                  }}
                  className="w-full px-3 py-2 exp-input"
                />
              </div>
            ))}
          </div>
        </div>

        <FormulaBlock title="NPV 公式" formula={String.raw`NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t}`} />
        <FormulaBlock title="IRR 公式" formula="NPV(IRR) = 0" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard
            title="净现值 (NPV)"
            value={result.npv.toFixed(2)}
            prefix="¥"
            valueColor={result.npv > 0 ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="内部收益率 (IRR)"
            value={(result.irr * 100).toFixed(2)}
            suffix="%"
            valueColor={result.irr > rate / 100 ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="动态回收期"
            value={result.dpp.toFixed(1)}
            suffix="年"
            className="border border-gray-200 rounded-lg p-6"
          />
          <StatisticCard
            title="可行性"
            value={result.feasible ? "可行" : "不可行"}
            valueColor={result.feasible ? "text-green-600" : "text-red-600"}
            className="border border-gray-200 rounded-lg p-6"
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">折现现金流图</h2>
          <LineChart
            xAxisData={discountData.map((d) => d.name)}
            series={[{ name: "折现现金流", data: discountData.map((d) => d.value), color: "#3b82f6" }]}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
