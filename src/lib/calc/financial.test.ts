import { describe, test, expect } from "bun:test";
import { npv, irr, dpp, isFeasible, calculateScore, TEST_CASHFLOWS, TEST_RATE, EXPECTED_NPV } from "./financial";

describe("财务计算引擎", () => {
  describe("npv()", () => {
    test("计算简单 NPV", () => {
      const result = npv([-10000, 3000, 4000, 5000, 2000], 0.1);
      expect(result).toBeCloseTo(1155.66, 0);
    });

    test("NPV 为负数", () => {
      const result = npv([-10000, 1000, 1000, 1000], 0.1);
      expect(result).toBeLessThan(0);
    });

    test("零折现率等于简单求和", () => {
      const result = npv([-10000, 3000, 4000, 5000], 0);
      expect(result).toBe(2000);
    });

    test("空数组返回 0", () => {
      expect(npv([], 0.1)).toBe(0);
    });
  });

  describe("irr()", () => {
    test("计算 IRR", () => {
      const result = irr([-10000, 3000, 4000, 5000, 2000]);
      expect(result).toBeCloseTo(0.153, 2); // 约 15.3%
    });

    test("无法计算时返回 null", () => {
      expect(irr([1000, 2000, 3000])).toBeNull(); // 全正
      expect(irr([-1000, -2000, -3000])).toBeNull(); // 全负
      expect(irr([])).toBeNull(); // 空数组
    });
  });

  describe("dpp()", () => {
    test("计算动态回收期", () => {
      const result = dpp([-10000, 3000, 4000, 5000, 2000], 0.1);
      expect(result).toBeLessThan(4);
      expect(result).toBeGreaterThan(3);
    });

    test("无法回收返回 null", () => {
      const result = dpp([-10000, 1000, 1000, 1000], 0.1);
      expect(result).toBeNull();
    });
  });

  describe("isFeasible()", () => {
    test("正 NPV 可行", () => {
      expect(isFeasible(1000)).toBe(true);
    });

    test("零或负 NPV 不可行", () => {
      expect(isFeasible(0)).toBe(false);
      expect(isFeasible(-1000)).toBe(false);
    });
  });

  describe("calculateScore()", () => {
    test("计算综合评分", () => {
      const score = calculateScore(2670, 0.144, 3.5, 0.1);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
