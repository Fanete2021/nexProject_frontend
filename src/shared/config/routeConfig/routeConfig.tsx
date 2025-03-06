import { MainPage } from "@/pages/main-page";
import { AuthPage } from "@/pages/auth-page";
import { PathRouteProps } from "react-router-dom";

export type AppRoutesProps = PathRouteProps & {
};

export enum AppRoutes {
  AUTH = "auth",
  MAIN = "main",
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.AUTH]: "/",
  [AppRoutes.MAIN]: "/main",
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.AUTH]: {
    path: `${RoutePath.auth}`,
    element: <AuthPage />,
  },
  [AppRoutes.MAIN]: {
    path: `${RoutePath.main}`,
    element: <MainPage />,
  },
};
