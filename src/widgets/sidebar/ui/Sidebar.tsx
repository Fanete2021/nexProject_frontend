import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Sidebar.module.scss';
import { icons, Logo, SvgIcon } from '@/shared/ui';
import { SidebarItemsList } from '../model/items.ts';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { logout } from '@/features/auth';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { TABLET_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';

export interface SidebarProps {
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const { className } = props;

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();
  const [ expanded, setExpanded ] = useState<boolean>(windowWidth <= TABLET_MAX_BREAKPOINT);

  const onMouseLeaveHandler = useCallback(() => {
    if (windowWidth > TABLET_MAX_BREAKPOINT) {
      setExpanded(false);
    }
  }, [windowWidth]);

  const mods: Record<string, boolean> = {
    [styles.expanded]: expanded
  };

  const links = useMemo(() => SidebarItemsList.map((item) => (
    <Link
      className={classNames(
        styles.linkWrapper,
        [location.pathname === item.path && styles.activeLinkWrapper]
      )}
      to={item.path}
      key={item.path}
    >
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
      className={classNames(styles.Sidebar, [className], mods)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={onMouseLeaveHandler}
    >
      <Logo className={styles.logo}/>

      <div className={styles.linksWrapper}>
        {links}
      </div>

      <div className={styles.footer}>
        <div className={styles.linkWrapper}>
          <SvgIcon
            className={classNames(styles.icon,[styles.applyIconFill])}
            iconName={icons.SETTINGS}
          />

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
          <SvgIcon
            className={classNames(styles.icon,[styles.applyIconFill])}
            iconName={icons.CHANGES}
          />

          {expanded &&
            <div className={styles.text}>
              {t('Изменения') as string}
            </div>
          }
        </Link>

        <button className={styles.linkWrapper} onClick={logoutHandler}>
          <SvgIcon
            className={classNames(styles.icon,[styles.applyIconFill])}
            iconName={icons.LOGOUT}
          />

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
