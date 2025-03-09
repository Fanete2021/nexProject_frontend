import { memo, Suspense, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routeConfig, AppRoutesProps } from '@/shared/config/routeConfig/routeConfig.tsx';
import { Loader } from '@/shared/ui/Loader';

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
                element={children}
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
