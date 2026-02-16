import { FunctionPointCalculator, type WeightMap } from "@/components/experiments/function-point-calculator";

const NESMA_WEIGHTS: WeightMap = {
  ILF: { low: 7, medium: 10, high: 15 },
  EIF: { low: 5, medium: 7, high: 10 },
  EI: { low: 3, medium: 4, high: 6 },
  EO: { low: 4, medium: 5, high: 7 },
  EQ: { low: 3, medium: 4, high: 6 },
};

export default function NesmaPage() {
  return (
    <FunctionPointCalculator
      title="NESMA 功能点度量"
      methodName="NESMA FPA（详细级与 IFPUG 对齐）"
      weights={NESMA_WEIGHTS}
      exportFilename="NESMA功能点度量.pdf"
    />
  );
}
