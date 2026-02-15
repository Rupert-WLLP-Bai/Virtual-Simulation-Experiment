/**
 * 碳排放权 Vickrey 拍卖计算
 * 第二价格密封拍卖
 */

export interface CarbonExperiment {
  id: string;
  sellerPrices: { id: string; price: number; quantity: number }[];
  buyerPrices: { id: string; price: number; quantity: number }[];
}

export interface CarbonResult {
  equilibriumPrice: number;
  equilibriumQuantity: number;
  transactionVolume: number;
  totalTransaction: number;
  sellerResults: { id: string; quantity: number; price: number; revenue: number }[];
  buyerResults: { id: string; quantity: number; price: number; cost: number }[];
  supplyCurve: { price: number; cumQuantity: number }[];
  demandCurve: { price: number; cumQuantity: number }[];
}

/**
 * 运行 Vickrey 拍卖
 */
export function carbonAuction(experiment: CarbonExperiment): CarbonResult {
  // 卖方：按价格升序排列
  const sellers = [...experiment.sellerPrices].sort((a, b) => a.price - b.price);
  let cumSellerQty = 0;
  const supplyCurve: { price: number; cumQuantity: number }[] = [];
  sellers.forEach((s) => {
    cumSellerQty += s.quantity;
    supplyCurve.push({ price: s.price, cumQuantity: cumSellerQty });
  });

  // 买方：按价格降序排列
  const buyers = [...experiment.buyerPrices].sort((a, b) => b.price - a.price);
  let cumBuyerQty = 0;
  const demandCurve: { price: number; cumQuantity: number }[] = [];
  buyers.forEach((b) => {
    cumBuyerQty += b.quantity;
    demandCurve.push({ price: b.price, cumQuantity: cumBuyerQty });
  });

  // 找均衡点：供给曲线和需求曲线的交点
  let equilibriumPrice = 0;
  let equilibriumQuantity = 0;

  for (let i = 0; i < Math.min(supplyCurve.length, demandCurve.length); i++) {
    if (supplyCurve[i]!.cumQuantity <= demandCurve[i]!.cumQuantity) {
      equilibriumQuantity = supplyCurve[i]!.cumQuantity;
      // 均衡价格：最后一个匹配的价格
      equilibriumPrice = Math.min(supplyCurve[i]!.price, demandCurve[i]!.price);
    }
  }

  // 计算卖方结果
  const sellerResults: CarbonResult["sellerResults"] = [];
  let allocatedQty = 0;
  sellers.forEach((s) => {
    const allocated = Math.min(s.quantity, Math.max(0, equilibriumQuantity - allocatedQty));
    if (allocated > 0) {
      // 卖方获得第二低价格
      const winningPrice = sellers.find((sp) => sp.price > s.price)?.price || s.price;
      sellerResults.push({
        id: s.id,
        quantity: allocated,
        price: winningPrice,
        revenue: allocated * winningPrice,
      });
      allocatedQty += allocated;
    }
  });

  // 计算买方结果
  const buyerResults: CarbonResult["buyerResults"] = [];
  allocatedQty = 0;
  buyers.forEach((b) => {
    const allocated = Math.min(b.quantity, Math.max(0, equilibriumQuantity - allocatedQty));
    if (allocated > 0) {
      // 买方支付第二高价格
      const winningPrice = buyers.find((bp) => bp.price < b.price)?.price || b.price;
      buyerResults.push({
        id: b.id,
        quantity: allocated,
        price: winningPrice,
        cost: allocated * winningPrice,
      });
      allocatedQty += allocated;
    }
  });

  const totalTransaction = sellerResults.reduce((sum, r) => sum + r.revenue, 0);

  return {
    equilibriumPrice,
    equilibriumQuantity,
    transactionVolume: equilibriumQuantity,
    totalTransaction: Math.round(totalTransaction * 100) / 100,
    sellerResults,
    buyerResults,
    supplyCurve,
    demandCurve,
  };
}
