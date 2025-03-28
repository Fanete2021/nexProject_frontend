import { Suspense, useEffect, useState } from 'react';
import './styles/index.scss';
import { Loader } from '@/shared/ui';
import AppRouter from './providers/router/AppRouter.tsx';
import { useTheme } from '@/app/providers/theme-provider';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { refreshToken } from '@/features/auth';
import { fetchUserData } from '@/entities/user';

const App = () => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const [isAppReady, setIsAppReady] = useState(false);

    useEffect(() => {
        const initStore = async () => {
            try {
                await dispatch(refreshToken()).unwrap();
                await dispatch(fetchUserData()).unwrap();
            } catch (error) {
                console.log('refreshToken: ', error);
            } finally {
                setIsAppReady(true);
            }
        };

        initStore();
    }, []);

    if (!isAppReady) {
        return <Loader />;
    }

    return (
        <div className={classNames('app', [ theme ])}>
            <Suspense fallback={<Loader />}>
                <AppRouter />
            </Suspense>
        </div>
    );
};

export default App;
