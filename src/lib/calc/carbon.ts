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
  // 卖方报价（升序）与买方报价（降序）
  const sellers = [...experiment.sellerPrices]
    .map((s) => ({ ...s, quantity: Math.max(0, s.quantity), price: Math.max(0, s.price) }))
    .sort((a, b) => a.price - b.price);
  const buyers = [...experiment.buyerPrices]
    .map((b) => ({ ...b, quantity: Math.max(0, b.quantity), price: Math.max(0, b.price) }))
    .sort((a, b) => b.price - a.price);

  const supplyCurve: { price: number; cumQuantity: number }[] = [];
  const demandCurve: { price: number; cumQuantity: number }[] = [];
  let cumSellerQty = 0;
  let cumBuyerQty = 0;

  sellers.forEach((s) => {
    cumSellerQty += s.quantity;
    supplyCurve.push({ price: s.price, cumQuantity: cumSellerQty });
  });
  buyers.forEach((b) => {
    cumBuyerQty += b.quantity;
    demandCurve.push({ price: b.price, cumQuantity: cumBuyerQty });
  });

  type Match = { sellerId: string; buyerId: string; quantity: number };
  const matches: Match[] = [];
  let i = 0;
  let j = 0;
  let totalMatchedQuantity = 0;
  let marginalSellerPrice = 0;
  let marginalBuyerPrice = 0;

  // 按价格优先进行双边撮合：只在 buy >= sell 时成交
  while (i < sellers.length && j < buyers.length) {
    const seller = sellers[i]!;
    const buyer = buyers[j]!;

    if (buyer.price < seller.price) {
      break;
    }

    const quantity = Math.min(seller.quantity, buyer.quantity);
    if (quantity <= 0) {
      if (seller.quantity <= 0) i++;
      if (buyer.quantity <= 0) j++;
      continue;
    }

    matches.push({
      sellerId: seller.id,
      buyerId: buyer.id,
      quantity,
    });

    totalMatchedQuantity += quantity;
    marginalSellerPrice = seller.price;
    marginalBuyerPrice = buyer.price;

    seller.quantity -= quantity;
    buyer.quantity -= quantity;

    if (seller.quantity <= 0) i++;
    if (buyer.quantity <= 0) j++;
  }

  const equilibriumQuantity = totalMatchedQuantity;
  const equilibriumPrice =
    equilibriumQuantity > 0
      ? Math.round(((marginalSellerPrice + marginalBuyerPrice) / 2) * 100) / 100
      : 0;

  const sellerMap = new Map<string, number>();
  const buyerMap = new Map<string, number>();
  matches.forEach((m) => {
    sellerMap.set(m.sellerId, (sellerMap.get(m.sellerId) || 0) + m.quantity);
    buyerMap.set(m.buyerId, (buyerMap.get(m.buyerId) || 0) + m.quantity);
  });

  const sellerResults: CarbonResult["sellerResults"] = experiment.sellerPrices
    .filter((s) => (sellerMap.get(s.id) || 0) > 0)
    .map((s) => {
      const quantity = sellerMap.get(s.id) || 0;
      return {
        id: s.id,
        quantity,
        price: equilibriumPrice,
        revenue: Math.round(quantity * equilibriumPrice * 100) / 100,
      };
    });

  const buyerResults: CarbonResult["buyerResults"] = experiment.buyerPrices
    .filter((b) => (buyerMap.get(b.id) || 0) > 0)
    .map((b) => {
      const quantity = buyerMap.get(b.id) || 0;
      return {
        id: b.id,
        quantity,
        price: equilibriumPrice,
        cost: Math.round(quantity * equilibriumPrice * 100) / 100,
      };
    });

  const totalTransaction = Math.round(equilibriumQuantity * equilibriumPrice * 100) / 100;

  return {
    equilibriumPrice,
    equilibriumQuantity,
    transactionVolume: equilibriumQuantity,
    totalTransaction,
    sellerResults,
    buyerResults,
    supplyCurve,
    demandCurve,
  };
}
