import { useParams, useNavigate } from "react-router-dom";

export default function ExperimentPage() {
  const { module, experiment } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← 返回
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              实验 {module} - {experiment}
            </h1>
          </div>
        </div>
      </header>

      {/* 实验内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-gray-600">
            实验组件 "{experiment}" (模块 {module}) 正在开发中...
          </p>
        </div>
      </main>
    </div>
  );
}
