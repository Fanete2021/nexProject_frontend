import { LoginForm } from '@/features/auth';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import styles from './AuthPage.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { GuestPageLayout } from '@/widgets/guest-page-layout';

const AuthPage = () => {
    const { t } = useTranslation();

    return (
        <GuestPageLayout title={'Вход'}>
            <LoginForm />

            <Link 
                to={RoutePath.registration} 
                className={classNames(styles.guestLink, ['guestLink'])}
            >
                {t('Нет аккаунта?')}
            </Link>
        </GuestPageLayout>
    );
};

export default AuthPage;
