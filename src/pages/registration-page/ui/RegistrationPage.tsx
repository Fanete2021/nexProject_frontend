import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { RegistrationForm } from '@/features/registration';
import { useTranslation } from 'react-i18next';
import styles from './RegistrationPage.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

const RegistrationPage = () => {
  const { t } = useTranslation();
    
  return (
    <>
      <div className='title'>
        {t('Создание аккаунта') as string}
      </div>

      <RegistrationForm />

      <Link
        to={RoutePath.auth}
        className={classNames(styles.guestLink, ['guestLink'])}
      >
        <>{t('Уже есть аккаунт?')}</>
      </Link>
    </>
  );
};

export default RegistrationPage;
