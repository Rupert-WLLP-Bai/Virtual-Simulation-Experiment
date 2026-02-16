import { FunctionPointCalculator, type WeightMap } from "@/components/experiments/function-point-calculator";

const IFPUG_WEIGHTS: WeightMap = {
  ILF: { low: 7, medium: 10, high: 15 },
  EIF: { low: 5, medium: 7, high: 10 },
  EI: { low: 3, medium: 4, high: 6 },
  EO: { low: 4, medium: 5, high: 7 },
  EQ: { low: 3, medium: 4, high: 6 },
};

export default function IfpugPage() {
  return (
    <FunctionPointCalculator
      title="IFPUG 功能点度量"
      methodName="IFPUG Function Point Analysis（ISO/IEC 20926）"
      weights={IFPUG_WEIGHTS}
      exportFilename="IFPUG功能点度量.pdf"
    />
  );
}
