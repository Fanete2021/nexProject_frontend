import { memo, Suspense, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routeConfig, AppRoutesProps } from '@/shared/config/routeConfig/routeConfig.tsx';
import RequireAuth from '@/app/providers/router/RequireAuth.tsx';
import { Loader } from '@/shared/ui';
import GuestRoutes from '@/app/providers/router/GuestRoutes.tsx';

const AppRouter = () => {
  const renderWithWrapper = useCallback((route: AppRoutesProps) => {
    const { element } = route;

    const children = (
      <Suspense fallback={<Loader />}>
        {element}
      </Suspense>
    );

    return (
      <Route
        key={route.path}
        path={route.path}
        element={route.authOnly
          ? <RequireAuth>{children}</RequireAuth>
          : <GuestRoutes>{children}</GuestRoutes>
        }
      />
    );
  }, []);

  return (
    <Routes>
      {Object.values(routeConfig).map(renderWithWrapper)}
    </Routes>
  );
};

export default memo(AppRouter);
