import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { RegistrationForm } from '@/features/registration';
import { GuestPageLayout } from '@/widgets/GuestPageLayout';
import { useTranslation } from 'react-i18next';
import styles from './RegistrationPage.module.scss';

const RegistrationPage = () => {
    const { t } = useTranslation();
    
    return (
        <GuestPageLayout title="Создание аккаунта" >
            <RegistrationForm />

            <Link to={RoutePath.auth} className={styles.footer}>
                {t('Уже есть аккаунт?')}
            </Link>
        </GuestPageLayout>
    );
};

export default RegistrationPage;
