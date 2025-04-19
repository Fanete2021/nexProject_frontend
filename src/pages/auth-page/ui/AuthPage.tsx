import { LoginForm } from '@/features/auth';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import styles from './AuthPage.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

const AuthPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className='title'>
        {t('Вход') as string}
      </div>

      <LoginForm />

      <Link 
        to={RoutePath.registration} 
        className={classNames(styles.guestLink, ['guestLink'])}
      >
        <>{t('Нет аккаунта?')}</>
      </Link>
    </>
  );
};

export default AuthPage;
