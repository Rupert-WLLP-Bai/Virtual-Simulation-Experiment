import { useParams, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// 使用 React.lazy 懒加载实验组件
const experiments: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  cosmic: lazy(() => import("@/pages/exp1/cosmic/index.tsx")),
  markii: lazy(() => import("@/pages/exp1/markii/index.tsx")),
  singlescheme: lazy(() => import("@/pages/exp1/singlescheme/index.tsx")),
  tanpaifang: lazy(() => import("@/pages/exp6/tanpaifang/index.tsx")),
  jinxianzhi: lazy(() => import("@/pages/exp7/jinxianzhi/index.tsx")),
  yinkuipingheng: lazy(() => import("@/pages/exp7/yinkuipingheng/index.tsx")),
  minganxing: lazy(() => import("@/pages/exp8/minganxing/index.tsx")),
  buqueding: lazy(() => import("@/pages/exp9/buqueding/index.tsx")),
  decisiontree: lazy(() => import("@/pages/exp10/decisiontree/index.tsx")),
  montecarlo: lazy(() => import("@/pages/exp47/montecarlo/index.tsx")),
};

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">加载中...</p>
      </div>
    </div>
  );
}

export default function ExperimentPage() {
  const { module, experiment } = useParams();
  const navigate = useNavigate();

  const key = experiment?.toLowerCase() || "";
  const ExperimentComponent = experiments[key];

  if (!ExperimentComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/home")} className="text-gray-600 hover:text-gray-800">
                ← 返回
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                实验 {module} - {experiment}
              </h1>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-400 mb-4">404</h2>
              <p className="text-gray-500 mb-4">未找到实验: {experiment}</p>
              <button
                onClick={() => navigate("/home")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                返回首页
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/home")} className="text-gray-600 hover:text-gray-800">
              ← 返回
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              实验 {module} - {experiment}
            </h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<Loading />}>
          <ExperimentComponent />
        </Suspense>
      </main>
    </div>
  );
}
