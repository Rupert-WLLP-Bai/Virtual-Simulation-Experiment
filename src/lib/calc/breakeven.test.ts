import { describe, test, expect } from "bun:test";
import { breakeven, getBreakevenStatus, targetSales, TEST_BREAKEVEN_INPUT } from "./breakeven";

describe("盈亏平衡计算", () => {
  describe("breakeven()", () => {
    test("计算盈亏平衡点", () => {
      const result = breakeven(TEST_BREAKEVEN_INPUT);
      expect(result.breakevenQuantity).toBe(5000);
      expect(result.breakevenSales).toBe(250000);
    });

    test("计算安全边际", () => {
      const result = breakeven(TEST_BREAKEVEN_INPUT);
      expect(result.safetyMargin).toBe(3000);
      expect(result.safetyMarginRate).toBe(37.5);
    });

    test("计算边际贡献", () => {
      const result = breakeven(TEST_BREAKEVEN_INPUT);
      expect(result.unitContribution).toBe(20);
      expect(result.contributionMarginRate).toBe(40);
    });
  });

  describe("getBreakevenStatus()", () => {
    test("盈利状态", () => {
      const result = breakeven(TEST_BREAKEVEN_INPUT);
      expect(getBreakevenStatus(result)).toBe("profit");
    });

    test("亏损状态", () => {
      const result = breakeven({
        fixedCost: 100000,
        variableCost: 45,
        unitPrice: 50,
        normalSales: 3000,
      });
      expect(getBreakevenStatus(result)).toBe("loss");
    });
  });

  describe("targetSales()", () => {
    test("计算目标利润销售量", () => {
      const target = targetSales(TEST_BREAKEVEN_INPUT, 50000);
      expect(target).toBe(7500);
    });
  });
});
