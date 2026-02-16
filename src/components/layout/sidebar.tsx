import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

interface Experiment {
  id: number;
  module_id: number;
  name: string;
  path: string;
  description?: string;
}

interface Module {
  id: number;
  name: string;
  experiments: Experiment[];
}

interface SidebarProps {
  onLogout?: () => void;
}

const FALLBACK_MODULES: Module[] = [
  {
    id: 1,
    name: "软件度量",
    experiments: [
      { id: 1, module_id: 1, name: "COSMIC功能点度量", path: "cosmic" },
      { id: 2, module_id: 1, name: "MARK II功能点度量", path: "markii" },
      { id: 3, module_id: 1, name: "IFPUG功能点", path: "ifpug" },
      { id: 4, module_id: 1, name: "NESMA功能点", path: "nesma" },
      { id: 5, module_id: 1, name: "GB11国标功能点", path: "gb11" },
    ],
  },
  {
    id: 2,
    name: "投资评价",
    experiments: [
      { id: 6, module_id: 2, name: "NPV/IRR评价", path: "jinxianzhi" },
      { id: 7, module_id: 2, name: "盈亏平衡分析", path: "yinkuipingheng" },
      { id: 8, module_id: 2, name: "动态投资回收期", path: "dongtaitouzi" },
      { id: 9, module_id: 2, name: "重置期", path: "chongzhiqi" },
      { id: 10, module_id: 2, name: "生命周期", path: "shengmingzhouqi" },
    ],
  },
  {
    id: 4,
    name: "风险分析",
    experiments: [
      { id: 11, module_id: 4, name: "敏感性分析", path: "minganxing" },
      { id: 12, module_id: 4, name: "博弈论决策", path: "boyi" },
      { id: 13, module_id: 4, name: "期望净现值法", path: "qiwangjingxianzhi" },
      { id: 14, module_id: 4, name: "决策树分析", path: "decisiontree" },
      { id: 15, module_id: 4, name: "蒙特卡洛模拟", path: "montecarlo" },
    ],
  },
];

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

export function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Fetch modules and experiments in parallel
    Promise.all([
      fetch("/api/menu/student_experiment").then((res) => res.json()),
      fetch("/api/modules").then((res) => res.json()).catch(() => []),
    ])
      .then(([experimentsPayload, modulesPayload]) => {
        const experiments = normalizeList<Experiment>(experimentsPayload);
        const modules = normalizeList<{ id: number; name: string }>(modulesPayload);

        if (experiments.length === 0) {
          setModules(FALLBACK_MODULES);
          setExpandedModules(new Set([FALLBACK_MODULES[0]!.id]));
          return;
        }

        // Create module id to name mapping
        const moduleMap = new Map(modules.map((m) => [m.id, m.name]));

        // Group experiments by module_id
        const grouped = experiments.reduce((acc, exp) => {
          if (!acc[exp.module_id]) {
            acc[exp.module_id] = [];
          }
          acc[exp.module_id].push(exp);
          return acc;
        }, {} as Record<number, Experiment[]>);

        const moduleList: Module[] = Object.entries(grouped).map(([moduleId, exps]) => ({
          id: Number(moduleId),
          name: moduleMap.get(Number(moduleId)) || `实验 ${moduleId}`,
          experiments: exps,
        }));

        setModules(moduleList);
        // Expand first module by default
        if (moduleList.length > 0) {
          setExpandedModules(new Set([moduleList[0].id]));
        }
      })
      .catch(() => {
        setModules(FALLBACK_MODULES);
        setExpandedModules(new Set([FALLBACK_MODULES[0]!.id]));
      });
  }, []);

  const toggleModule = (moduleId: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">VSE 虚拟仿真实验</h1>
        <p className="text-sm text-gray-400 mt-1">欢迎, {user?.name || "用户"}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {modules.map((module) => (
          <div key={module.id} className="mb-1">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium">{module.name}</span>
              <span className="text-gray-400 text-sm">
                {expandedModules.has(module.id) ? "▼" : "▶"}
              </span>
            </button>

            {expandedModules.has(module.id) && (
              <div className="bg-gray-800">
                {module.experiments.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => navigate(`/exp/${exp.module_id}/${exp.path}`)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                      isActive(`/${exp.module_id}/${exp.path}`)
                        ? "bg-gray-700 border-l-4 border-white"
                        : ""
                    }`}
                  >
                    {exp.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
