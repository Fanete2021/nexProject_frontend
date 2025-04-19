import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import styles from './NewPasswordPage.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { EmailForm } from '@/features/change-password';

const NewPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className='title'>
        {t('Укажите почту') as string}
      </div>

      <EmailForm />

      <Link
        to={RoutePath.auth}
        className={classNames(styles.guestLink, ['guestLink'])}
      >
        <>{t('Вернуться назад')}</>
      </Link>
    </>
  );
};

export default NewPasswordPage;
