import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import styles from './EmailConfirmPage.module.scss';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { EmailConfirmForm } from '@/features/confirm-email';
import { GuestPageLayout } from '@/widgets/guest-page-layout';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { userActions } from '@/entities/user';

const EmailConfirmPage = () => {
    const { t } = useTranslation();
    const user = useSelector(getUserData);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const navigateToAuthPage = useCallback(async () => {
        await dispatch(userActions.resetData());
        navigate(RoutePath.auth);
    }, [navigate, dispatch]);

    useEffect(() => {
        if (!user) {
            navigate(RoutePath.auth);
        }
    }, [user]);

    return (
        <GuestPageLayout
            title={'Пожалуйста, проверьте вашу электронную почту'}
        >
            <div className={styles.subtitle}>
                {t('Мы отправили код на')} <strong>{user?.email}</strong>
            </div>

            <EmailConfirmForm />

            <button
                onClick={navigateToAuthPage}
                className={classNames(styles.guestLink, ['guestLink'])}
            >
                <>{t('Вернуться назад')}</>
            </button>
        </GuestPageLayout>
    );
};

export default EmailConfirmPage;
