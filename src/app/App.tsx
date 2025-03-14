import { Suspense, useEffect } from 'react';
import './styles/index.scss';
import { Loader } from '@/shared/ui';
import AppRouter from './providers/router/AppRouter.tsx';
import { useTheme } from '@/app/providers/theme-provider';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { refreshToken } from '@/features/auth';

const App = () => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(refreshToken());
    }, []);

    return (
        <div className={classNames('app', [ theme ])}>
            <Suspense fallback={<Loader />}>
                <AppRouter />
            </Suspense>
        </div>
    );
};

export default App;
