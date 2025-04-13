import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { RegistrationForm } from '@/features/registration';
import { useTranslation } from 'react-i18next';
import styles from './RegistrationPage.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { GuestPageLayout } from '@/widgets/guest-page-layout';

const RegistrationPage = () => {
  const { t } = useTranslation();
    
  return (
    <GuestPageLayout title="Создание аккаунта" >
      <RegistrationForm />

      <Link
        to={RoutePath.auth}
        className={classNames(styles.guestLink, ['guestLink'])}
      >
        <>{t('Уже есть аккаунт?')}</>
      </Link>
    </GuestPageLayout>
  );
};

export default RegistrationPage;
