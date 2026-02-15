import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // 模拟实验列表
  const experiments = [
    { id: "exp1", name: "软件度量", module: 1, path: "cosmic" },
    { id: "exp5", name: "单方案评价", module: 5, path: "singlescheme" },
    { id: "exp6", name: "碳排放交易", module: 6, path: "tanpaifang" },
    { id: "exp7", name: "NPV/IRR评价", module: 7, path: "jinxianzhi" },
    { id: "exp7", name: "盈亏平衡分析", module: 7, path: "yinkuipingheng" },
    { id: "exp8", name: "敏感性分析", module: 8, path: "minganxing" },
    { id: "exp9", name: "不确定性决策", module: 9, path: "buqueding" },
    { id: "exp10", name: "决策树分析", module: 10, path: "decisiontree" },
    { id: "exp47", name: "蒙特卡洛模拟", module: 47, path: "montecarlo" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">虚拟仿真实验系统</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">欢迎, {user?.name || "用户"}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">选择实验</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp) => (
            <button
              key={exp.id}
              onClick={() => navigate(`/exp${exp.module}/${exp.path}`)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{exp.module}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{exp.name}</h3>
                  <p className="text-sm text-gray-500">实验 {exp.module}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
