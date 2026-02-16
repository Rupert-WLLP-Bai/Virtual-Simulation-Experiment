/**
 * MARK II 功能点度量计算
 * 使用逻辑交易维度：输入数据元素、实体类型引用、输出数据元素
 */

export interface MarkIIEntity {
  id: string;
  name: string;
  inputDataElements: number;
  entityTypeReferences: number;
  outputDataElements: number;
}

export interface MarkIIDetail {
  id: string;
  name: string;
  inputDataElements: number;
  entityTypeReferences: number;
  outputDataElements: number;
  fp: number;
}

export interface MarkIIResult {
  transactionCount: number;
  totalInputDataElements: number;
  totalEntityTypeReferences: number;
  totalOutputDataElements: number;
  unadjustedFP: number;
  totalFP: number;
  details: MarkIIDetail[];
}

// MARK II 常用计量权重（输入/实体引用/输出）
const WEIGHTS = {
  input: 0.58,
  entity: 1.66,
  output: 0.26,
} as const;

/**
 * 计算 MARK II 功能点（Unadjusted FP）
 */
export function markii(entities: MarkIIEntity[]): MarkIIResult {
  const details = entities.map((entity) => {
    const input = Math.max(0, Number(entity.inputDataElements) || 0);
    const refs = Math.max(0, Number(entity.entityTypeReferences) || 0);
    const output = Math.max(0, Number(entity.outputDataElements) || 0);

    const fp = input * WEIGHTS.input + refs * WEIGHTS.entity + output * WEIGHTS.output;
    return {
      id: entity.id,
      name: entity.name,
      inputDataElements: input,
      entityTypeReferences: refs,
      outputDataElements: output,
      fp: Math.round(fp * 100) / 100,
    };
  });

  const totals = details.reduce(
    (acc, item) => {
      acc.totalInputDataElements += item.inputDataElements;
      acc.totalEntityTypeReferences += item.entityTypeReferences;
      acc.totalOutputDataElements += item.outputDataElements;
      acc.unadjustedFP += item.fp;
      return acc;
    },
    {
      totalInputDataElements: 0,
      totalEntityTypeReferences: 0,
      totalOutputDataElements: 0,
      unadjustedFP: 0,
    }
  );

  const unadjustedFP = Math.round(totals.unadjustedFP * 100) / 100;

  return {
    transactionCount: details.length,
    totalInputDataElements: totals.totalInputDataElements,
    totalEntityTypeReferences: totals.totalEntityTypeReferences,
    totalOutputDataElements: totals.totalOutputDataElements,
    unadjustedFP,
    totalFP: unadjustedFP,
    details,
  };
}
