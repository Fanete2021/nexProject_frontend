import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { getIsAuth } from '@/features/auth';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';

function RequireAuth({ children }: {children: JSX.Element}) {
    const auth = useSelector(getIsAuth);
    const location = useLocation();

    if (!auth) {
        return <Navigate to={RoutePath.auth} state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;
