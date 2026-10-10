import ErrorPage from "@/pages/error";
import { RootLayout } from "@/pages/root-layout";
import { createBrowserRouter } from "react-router";
import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { publicRoutes } from "./public.routes";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [...publicRoutes, ...authRoutes, ...adminRoutes],
  },
]);
