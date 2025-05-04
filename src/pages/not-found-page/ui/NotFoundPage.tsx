import styles from './NotFoundPage.module.scss';
import { useTranslation } from 'react-i18next';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { icons, SvgIcon } from '@/shared/ui';
import { getAuthIsAuth } from '@/features/account/auth';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const isAuth = useSelector(getAuthIsAuth);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          {t('Страница не найдена') as string}
        </div>

        <SvgIcon
          iconName={icons.NOT_FOUND}
          className={styles.notFound}
          applyHover={false}
          important={true}
        />

        <Link
          to={isAuth ? RoutePath.main : RoutePath.auth}
          className={classNames(styles.link, ['guestLink'])}
        >
          {isAuth
            ? <>{t('Вернуться на главную страницу')}</>
            : <>{t('Вернуться к авторизации')}</>
          }
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
