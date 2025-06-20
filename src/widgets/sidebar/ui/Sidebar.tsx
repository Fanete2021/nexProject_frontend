import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Sidebar.module.scss';
import { icons, Logo, SvgIcon } from '@/shared/ui';
import { SidebarItemsList } from '../model/items.ts';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { logout } from '@/features/account/auth';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { TABLET_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';

export interface SidebarProps {
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const { className } = props;

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const windowWidth = useWindowWidth();

  const [ expanded, setExpanded ] = useState<boolean>(windowWidth <= TABLET_MAX_BREAKPOINT);

  const onMouseLeaveHandler = useCallback(() => {
    if (windowWidth > TABLET_MAX_BREAKPOINT) {
      setExpanded(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    closeSidebar();
  }, [location]);

  useEffect(() => {
    setExpanded(isSidebarOpen);
  }, [isSidebarOpen]);

  const links = useMemo(() => SidebarItemsList.map((item) => (
    <Link
      className={classNames(
        styles.linkWrapper,
        [],
        {
          [styles.activeLinkWrapper]: location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
        }
      )}
      to={item.path}
      key={item.path}
    >
      <div className={styles.iconWrapper}>
        <SvgIcon
          className={classNames(
            styles.icon,
            [],
            {
              [styles.applyIconFill]: item.applyIconFill,
              [styles.applyIconStroke]: item.applyIconStroke,
            }
          )}
          iconName={item.icon}
          applyStroke={false}
          applyFill={false}
          applyHover={false}
        />
      </div>

      {expanded &&
          <div className={styles.text}>
            {t(item.text) as string}
          </div>
      }
    </Link>
  )), [expanded, t, location]);
    
  const logoutHandler = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();

      navigate(RoutePath.auth);
    } catch (error) {
      console.log(error);
    }
  }, [navigate, dispatch]);

  return (
    <div
      className={classNames(styles.Sidebar, [className], {
        [styles.expanded]: expanded
      })}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={onMouseLeaveHandler}
    >
      <Logo className={styles.logo}/>

      <div className={styles.linksWrapper}>
        {links}
      </div>

      <div className={styles.footer}>
        <div className={styles.linkWrapper}>
          <div className={styles.iconWrapper}>
            <SvgIcon
              className={classNames(styles.icon,[styles.applyIconFill])}
              iconName={icons.SETTINGS}
            />
          </div>

          {expanded &&
            <div className={styles.text}>
              {t('Настройки') as string}
            </div>
          }
        </div>

        <Link
          className={classNames(
            styles.linkWrapper,
            [location.pathname === RoutePath.changes && styles.activeLinkWrapper]
          )}
          to={RoutePath.changes}
        >
          <div className={styles.iconWrapper}>
            <SvgIcon
              className={classNames(styles.icon,[styles.applyIconFill])}
              iconName={icons.CHANGES}
            />
          </div>

          {expanded &&
            <div className={styles.text}>
              {t('Изменения') as string}
            </div>
          }
        </Link>

        <button className={styles.linkWrapper} onClick={logoutHandler}>
          <div className={styles.iconWrapper}>
            <SvgIcon
              className={classNames(styles.icon,[styles.applyIconFill])}
              iconName={icons.LOGOUT}
            />
          </div>

          {expanded &&
            <div className={styles.text}>
              {t('Выйти') as string}
            </div>
          }
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
