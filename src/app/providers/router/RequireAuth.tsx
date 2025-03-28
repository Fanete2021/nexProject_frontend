import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { refreshToken } from '@/features/auth';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useEffect, useState } from 'react';
import { fetchUserData } from '@/entities/user';
import { Loader } from '@/shared/ui';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';

function RequireAuth({ children }: { children: JSX.Element }) {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const user = useSelector(getUserData);
    const [isAppReady, setIsAppReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initStore = async () => {
            try {
                await dispatch(refreshToken()).unwrap();
                await dispatch(fetchUserData()).unwrap();
                setIsAppReady(true);
            } catch (error) {
                console.log('refreshToken: ', error);
                setIsAppReady(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (!user) {
            initStore();
        } else {
            setIsAppReady(true);
            setIsLoading(false);
        }
    }, [dispatch, user]);

    if (isLoading) {
        return <Loader />;
    }

    if (!isAppReady) {
        return <Navigate to={RoutePath.auth} state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;
