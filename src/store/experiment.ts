import { create } from "zustand";

// 实验菜单项
export interface Experiment {
  id: string;
  module: number;
  name: string;
  path: string;
  description?: string;
}

// 实验记录
export interface ExperimentRecord {
  id: string;
  userId: string;
  experimentId: string;
  data: Record<string, unknown>;
  score?: number;
  completedAt?: string;
}

interface ExperimentState {
  experiments: Experiment[];
  currentExperiment: Experiment | null;
  records: ExperimentRecord[];
  loading: boolean;
  setExperiments: (experiments: Experiment[]) => void;
  setCurrentExperiment: (experiment: Experiment | null) => void;
  addRecord: (record: ExperimentRecord) => void;
  setRecords: (records: ExperimentState["records"]) => void;
}

// 模拟实验数据
const mockExperiments: Experiment[] = [
  { id: "exp1-cosmic", module: 1, name: "COSMIC功能点度量", path: "cosmic" },
  { id: "exp1-markii", module: 1, name: "MARK II功能点度量", path: "markii" },
  { id: "exp1-singlescheme", module: 1, name: "单方案财务评价", path: "singlescheme" },
  { id: "exp5-singlescheme", module: 5, name: "单方案评价", path: "singlescheme" },
  { id: "exp6-tanpaifang", module: 6, name: "碳排放权交易", path: "tanpaifang" },
  { id: "exp7-jinxianzhi", module: 7, name: "NPV/IRR评价", path: "jinxianzhi" },
  { id: "exp7-yinkuipingheng", module: 7, name: "盈亏平衡分析", path: "yinkuipingheng" },
  { id: "exp8-minganxing", module: 8, name: "敏感性分析", path: "minganxing" },
  { id: "exp9-buqueding", module: 9, name: "不确定性决策", path: "buqueding" },
  { id: "exp9-testcost", module: 9, name: "测试成本估算", path: "testcost" },
  { id: "exp10-decisiontree", module: 10, name: "决策树分析", path: "decisiontree" },
  { id: "exp47-montecarlo", module: 47, name: "蒙特卡洛模拟", path: "montecarlo" },
];

export const useExperimentStore = create<ExperimentState>((set) => ({
  experiments: mockExperiments,
  currentExperiment: null,
  records: [],
  loading: false,
  setExperiments: (experiments) => set({ experiments }),
  setCurrentExperiment: (experiment) => set({ currentExperiment: experiment }),
  addRecord: (record) => set((state) => ({ records: [...state.records, record] })),
  setRecords: (records) => set({ records }),
}));
