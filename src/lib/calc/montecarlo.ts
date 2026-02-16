/**
 * 蒙特卡洛模拟计算
 */

export interface MonteCarloInput {
  /** 变量定义 */
  variables: {
    name: string;
    distribution: "normal" | "uniform" | "triangular";
    params: { min?: number; max?: number; mean?: number; std?: number; mode?: number };
  }[];
  /** 模拟次数 */
  iterations: number;
  /** 计算函数 */
  formula: (values: Record<string, number>) => number;
}

export interface MonteCarloResult {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  p5: number; // 5%分位数
  p25: number;
  p75: number;
  p95: number;
  probabilityPositive: number;
  samples: number[];
}

/**
 * 生成随机数
 */
function randomNormal(mean: number, std: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * std + mean;
}

function randomUniform(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomTriangular(min: number, max: number, mode: number): number {
  const u = Math.random();
  const fc = (mode - min) / (max - min);
  if (u < fc) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  }
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

/**
 * 运行蒙特卡洛模拟
 */
export function monteCarlo(input: MonteCarloInput): MonteCarloResult {
  const samples: number[] = [];

  for (let i = 0; i < input.iterations; i++) {
    const values: Record<string, number> = {};
    input.variables.forEach((v) => {
      switch (v.distribution) {
        case "normal":
          values[v.name] = randomNormal(v.params.mean!, v.params.std!);
          break;
        case "uniform":
          values[v.name] = randomUniform(v.params.min!, v.params.max!);
          break;
        case "triangular":
          values[v.name] = randomTriangular(v.params.min!, v.params.max!, v.params.mode!);
          break;
      }
    });
    samples.push(input.formula(values));
  }

  samples.sort((a, b) => a - b);

  const sum = samples.reduce((a, b) => a + b, 0);
  const mean = sum / samples.length;
  const variance = samples.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / samples.length;
  const positiveCount = samples.filter((v) => v > 0).length;

  return {
    mean: Math.round(mean * 100) / 100,
    median: samples[Math.floor(samples.length / 2)],
    std: Math.round(Math.sqrt(variance) * 100) / 100,
    min: samples[0],
    max: samples[samples.length - 1],
    p5: samples[Math.floor(samples.length * 0.05)],
    p25: samples[Math.floor(samples.length * 0.25)],
    p75: samples[Math.floor(samples.length * 0.75)],
    p95: samples[Math.floor(samples.length * 0.95)],
    probabilityPositive: Math.round((positiveCount / samples.length) * 10000) / 100,
    samples,
  };
}
