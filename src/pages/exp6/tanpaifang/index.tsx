import { useState, useMemo } from "react";
import { carbonAuction, type CarbonExperiment, type CarbonResult } from "@/lib/calc";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";
import { ExportPDF } from "@/components/ui/export-pdf";

export default function TanpaifangPage() {
  const [sellerPrices, setSellerPrices] = useState<CarbonExperiment["sellerPrices"]>([
    { id: "s1", price: 20, quantity: 100 },
    { id: "s2", price: 30, quantity: 150 },
    { id: "s3", price: 40, quantity: 80 },
  ]);

  const [buyerPrices, setBuyerPrices] = useState<CarbonExperiment["buyerPrices"]>([
    { id: "b1", price: 50, quantity: 120 },
    { id: "b2", price: 45, quantity: 100 },
    { id: "b3", price: 35, quantity: 90 },
  ]);

  const experiment: CarbonExperiment = useMemo(
    () => ({ id: "exp1", sellerPrices, buyerPrices }),
    [sellerPrices, buyerPrices]
  );

  const result: CarbonResult = useMemo(() => carbonAuction(experiment), [experiment]);

  const addSeller = () => {
    setSellerPrices([...sellerPrices, { id: `s${sellerPrices.length + 1}`, price: 0, quantity: 0 }]);
  };

  const removeSeller = (id: string) => {
    setSellerPrices(sellerPrices.filter((s) => s.id !== id));
  };

  const updateSeller = (id: string, field: "price" | "quantity", value: number) => {
    setSellerPrices(sellerPrices.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addBuyer = () => {
    setBuyerPrices([...buyerPrices, { id: `b${buyerPrices.length + 1}`, price: 0, quantity: 0 }]);
  };

  const removeBuyer = (id: string) => {
    setBuyerPrices(buyerPrices.filter((b) => b.id !== id));
  };

  const updateBuyer = (id: string, field: "price" | "quantity", value: number) => {
    setBuyerPrices(buyerPrices.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const chartData = useMemo(() => {
    const maxQty = Math.max(
      result.supplyCurve[result.supplyCurve.length - 1]?.cumQuantity || 0,
      result.demandCurve[result.demandCurve.length - 1]?.cumQuantity || 0
    );
    const supplyData: { price: number; cumQuantity: number }[] = [];
    const demandData: { price: number; cumQuantity: number }[] = [];

    // 简化图表数据
    result.supplyCurve.forEach((s) => supplyData.push(s));
    result.demandCurve.forEach((d) => demandData.push(d));

    return { supply: supplyData, demand: demandData };
  }, [result]);

  return (
    <div className="min-h-screen bg-gray-50 p-6" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">碳排放权交易 (Vickrey 拍卖)</h1>
          <ExportPDF targetId="experiment-content" filename="碳排放权交易.pdf" />
        </div>

        {/* 卖方配置 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">卖方报价</h2>
            <button
              onClick={addSeller}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              添加卖方
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">卖方</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">最低报价（元/吨）</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">数量（吨）</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {sellerPrices.map((seller) => (
                <tr key={seller.id} className="border-t">
                  <td className="px-4 py-2">{seller.id}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={seller.price}
                      onChange={(e) => updateSeller(seller.id, "price", Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={seller.quantity}
                      onChange={(e) => updateSeller(seller.id, "quantity", Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => removeSeller(seller.id)} className="text-red-600 hover:text-red-800">
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 买方配置 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">买方报价</h2>
            <button
              onClick={addBuyer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              添加买方
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">买方</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">最高报价（元/吨）</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">需求量（吨）</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {buyerPrices.map((buyer) => (
                <tr key={buyer.id} className="border-t">
                  <td className="px-4 py-2">{buyer.id}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={buyer.price}
                      onChange={(e) => updateBuyer(buyer.id, "price", Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={buyer.quantity}
                      onChange={(e) => updateBuyer(buyer.id, "quantity", Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => removeBuyer(buyer.id)} className="text-red-600 hover:text-red-800">
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 统计结果 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="均衡价格" value={result.equilibriumPrice} prefix="¥" valueColor="text-blue-600" />
          <StatisticCard
            title="均衡数量"
            value={result.equilibriumQuantity}
            suffix="吨"
            valueColor="text-green-600"
          />
          <StatisticCard
            title="成交量"
            value={result.transactionVolume}
            suffix="吨"
            valueColor="text-purple-600"
          />
          <StatisticCard
            title="总交易额"
            value={result.totalTransaction}
            prefix="¥"
            valueColor="text-orange-600"
          />
        </div>

        {/* 卖方结果 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">卖方成交结果</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">卖方</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">成交量</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">结算价格</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">收入</th>
              </tr>
            </thead>
            <tbody>
              {result.sellerResults.length > 0 ? (
                result.sellerResults.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2">{r.id}</td>
                    <td className="px-4 py-2">{r.quantity}</td>
                    <td className="px-4 py-2">¥{r.price}</td>
                    <td className="px-4 py-2">¥{r.revenue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    无成交
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 买方结果 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">买方成交结果</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">买方</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">成交量</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">支付价格</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">成本</th>
              </tr>
            </thead>
            <tbody>
              {result.buyerResults.length > 0 ? (
                result.buyerResults.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2">{r.id}</td>
                    <td className="px-4 py-2">{r.quantity}</td>
                    <td className="px-4 py-2">¥{r.price}</td>
                    <td className="px-4 py-2">¥{r.cost}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    无成交
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 图表 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">供需曲线</h2>
          <LineChart
            title=""
            xAxisData={chartData.supply.map((d) => d.cumQuantity.toString())}
            series={[
              { name: "供给曲线", data: chartData.supply.map((d) => d.price), color: "#22c55e" },
              { name: "需求曲线", data: chartData.demand.map((d) => d.price), color: "#ef4444" },
            ]}
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
