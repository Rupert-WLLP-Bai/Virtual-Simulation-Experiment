import { FunctionPointCalculator, type WeightMap } from "@/components/experiments/function-point-calculator";

const GB21_WEIGHTS: WeightMap = {
  ILF: { low: 7, medium: 10, high: 15 },
  EIF: { low: 5, medium: 7, high: 10 },
  EI: { low: 3, medium: 4, high: 6 },
  EO: { low: 4, medium: 5, high: 7 },
  EQ: { low: 3, medium: 4, high: 6 },
};

export default function Gb21Page() {
  return (
    <FunctionPointCalculator
      title="GB21 国标功能点度量"
      methodName="GB/T 18491 功能点估算（开发成本场景）"
      weights={GB21_WEIGHTS}
      exportFilename="GB21功能点度量.pdf"
    />
  );
}
