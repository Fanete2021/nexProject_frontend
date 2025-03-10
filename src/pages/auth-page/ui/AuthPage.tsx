import { LoginForm } from '@/features/auth';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { GuestPageLayout } from '@/widgets/GuestPageLayout';

const AuthPage = () => {
    const { t } = useTranslation();

    return (
        <GuestPageLayout title={'Вход'}>
            <LoginForm />

            <Link to={RoutePath.registration} className="">
                {t('Нет аккаунта?')}
            </Link>
        </GuestPageLayout>
    );
};

export default AuthPage;
