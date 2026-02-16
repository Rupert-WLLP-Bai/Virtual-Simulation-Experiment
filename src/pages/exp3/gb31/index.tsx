import { FunctionPointCalculator, type WeightMap } from "@/components/experiments/function-point-calculator";

const GB31_WEIGHTS: WeightMap = {
  ILF: { low: 7, medium: 10, high: 15 },
  EIF: { low: 5, medium: 7, high: 10 },
  EI: { low: 3, medium: 4, high: 6 },
  EO: { low: 4, medium: 5, high: 7 },
  EQ: { low: 3, medium: 4, high: 6 },
};

export default function Gb31Page() {
  return (
    <FunctionPointCalculator
      title="GB31 国标功能点度量"
      methodName="GB/T 18491 功能点估算（测试成本场景）"
      weights={GB31_WEIGHTS}
      exportFilename="GB31功能点度量.pdf"
    />
  );
}
