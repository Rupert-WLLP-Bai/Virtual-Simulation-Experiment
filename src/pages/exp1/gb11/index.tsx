import { FunctionPointCalculator, type WeightMap } from "@/components/experiments/function-point-calculator";

const GB11_WEIGHTS: WeightMap = {
  ILF: { low: 7, medium: 10, high: 15 },
  EIF: { low: 5, medium: 7, high: 10 },
  EI: { low: 3, medium: 4, high: 6 },
  EO: { low: 4, medium: 5, high: 7 },
  EQ: { low: 3, medium: 4, high: 6 },
};

export default function Gb11Page() {
  return (
    <FunctionPointCalculator
      title="GB11 国标功能点度量"
      methodName="GB/T 18491 功能规模测量参考口径"
      weights={GB11_WEIGHTS}
      exportFilename="GB11功能点度量.pdf"
    />
  );
}
