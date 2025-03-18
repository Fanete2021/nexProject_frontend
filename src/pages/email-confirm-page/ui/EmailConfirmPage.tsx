import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import styles from './EmailConfirmPage.module.scss';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { EmailConfirmForm } from '@/features/confirm-email';
import { GuestPageLayout } from '@/widgets/guest-page-layout';

const EmailConfirmPage = () => {
    const { t } = useTranslation();
    const user = useSelector(getUserData);

    return (
        <GuestPageLayout
            title={'Пожалуйста, проверьте вашу электронную почту'}
        >
            <div className={styles.subtitle}>
                {t('Мы отправили код на')} <strong>{user?.email}</strong>
            </div>

            <EmailConfirmForm />

            <Link
                to={RoutePath.auth}
                className={classNames(styles.guestLink, ['guestLink'])}
            >
                <>{t('Вернуться назад')}</>
            </Link>
        </GuestPageLayout>
    );
};

export default EmailConfirmPage;
