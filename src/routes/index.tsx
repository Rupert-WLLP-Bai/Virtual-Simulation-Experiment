import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import ExperimentPage from "@/pages/experiment";

// 实验组件映射
const experimentComponents: Record<string, React.ComponentType> = {
  // exp1
  "1-cosmic": () => import("@/pages/exp1/cosmic"),
  "1-markii": () => import("@/pages/exp1/markii"),
  "1-singlescheme": () => import("@/pages/exp1/singlescheme"),
  // exp6
  "6-tanpaifang": () => import("@/pages/exp6/tanpaifang"),
  // exp7
  "7-jinxianzhi": () => import("@/pages/exp7/jinxianzhi"),
  "7-yinkuipingheng": () => import("@/pages/exp7/yinkuipingheng"),
  // exp8
  "8-minganxing": () => import("@/pages/exp8/minganxing"),
  // exp9
  "9-buqueding": () => import("@/pages/exp9/buqueding"),
  // exp10
  "10-decisiontree": () => import("@/pages/exp10/decisiontree"),
  // exp47
  "47-montecarlo": () => import("@/pages/exp47/montecarlo"),
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/exp/:module/:experiment",
    element: <ExperimentPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export { router, experimentComponents };
