import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import ExperimentPage from "@/pages/experiment";

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

export { router };
