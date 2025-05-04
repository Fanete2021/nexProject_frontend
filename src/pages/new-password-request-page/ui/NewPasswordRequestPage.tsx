import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import styles from './NewPasswordRequestPage.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { SendCodeForm } from '@/features/account/change-password';

const NewPasswordRequestPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className='title'>
        {t('Укажите почту') as string}
      </div>

      <SendCodeForm />

      <Link
        to={RoutePath.auth}
        className={classNames(styles.guestLink, ['guestLink'])}
      >
        <>{t('Вернуться назад')}</>
      </Link>
    </>
  );
};

export default NewPasswordRequestPage;
