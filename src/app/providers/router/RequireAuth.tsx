import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useEffect, useState } from 'react';
import { fetchUserData, getUserData } from '@/entities/user';
import { Loader } from '@/shared/ui';
import useRefreshTokenTimer from '@/shared/lib/hooks/useRefreshTokenTimer';
import { SidebarProvider } from '@/app/providers/sidebar-provider';
import { AuthenticatedPageLayout } from '@/widgets/authenticated-page-layout';
import { refreshToken } from '@/features/account/auth';
import { fetchMyOrganizations } from '@/entities/organization';

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useSelector(getUserData);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useRefreshTokenTimer();

  useEffect(() => {
    const initStore = async () => {
      try {
        await dispatch(refreshToken()).unwrap();

        const promises = [];
        if (!user) {
          promises.push(dispatch(fetchUserData()).unwrap());
        }

        promises.push(dispatch(fetchMyOrganizations()).unwrap());

        await Promise.all(promises);
        setIsAppReady(true);
      } catch (error) {
        setIsAppReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    initStore();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAppReady) {
    return <Navigate to={RoutePath.auth} state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider>
      <AuthenticatedPageLayout>
        {children}
      </AuthenticatedPageLayout>
    </SidebarProvider>
  );
}

export default RequireAuth;
