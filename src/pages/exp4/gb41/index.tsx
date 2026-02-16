import { FunctionPointCalculator, type WeightMap } from "@/components/experiments/function-point-calculator";

const GB41_WEIGHTS: WeightMap = {
  ILF: { low: 7, medium: 10, high: 15 },
  EIF: { low: 5, medium: 7, high: 10 },
  EI: { low: 3, medium: 4, high: 6 },
  EO: { low: 4, medium: 5, high: 7 },
  EQ: { low: 3, medium: 4, high: 6 },
};

export default function Gb41Page() {
  return (
    <FunctionPointCalculator
      title="GB41 国标功能点度量"
      methodName="GB/T 18491 功能点估算（运维成本场景）"
      weights={GB41_WEIGHTS}
      exportFilename="GB41功能点度量.pdf"
    />
  );
}
