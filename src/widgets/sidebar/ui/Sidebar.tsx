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
  const [ expanded, setExpanded ] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (windowWidth <= TABLET_MAX_BREAKPOINT) {
      setExpanded(true);
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
      onMouseLeave={() => setExpanded(false)}
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

      <svg width="157" height="191" viewBox="0 0 157 191" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_427_341)">
          <path d="M82.5 5V91.5L145 107.5M82.5 5L145 17.5M82.5 5L94 0L156.5 12.5M145 107.5V93.5M145 107.5L156.5 102.5V88.5M145 93.5L98.0002 80.7227V58L109.5 61M145 93.5L156.5 88.5M145 69.5V55.5M145 69.5L109.5 61M145 69.5L156.5 64.5V50.5M145 55.5L98.0002 45V20.5L109.5 23M145 55.5L156.5 50.5M145 31.5V17.5M145 31.5L109.5 23M145 31.5L156.5 26.5V12.5M145 17.5L156.5 12.5M156.5 88.5L109.5 75.22V61M156.5 50.5L109.5 40V23" fill="black"/>
          <path d="M11.5 107.5L0 102.5V5L11.5 3.05176e-05M11.5 107.5L23 104.5V41M11.5 107.5V3.05176e-05M11.5 3.05176e-05L23 5L51 54M62.5 96.5L74 91.5V5L62.5 0M62.5 96.5L51 91.5L23 41M62.5 96.5L23 25V41M62.5 0L51 5V54M62.5 0V76.5L51 54" fill="black"/>
          <path d="M11.498 174.5L37.9985 181M11.498 174.5V183.5L37.9985 190M11.498 174.5L53.0672 147.499M37.9985 181V190M37.9985 181L71.3211 159.356L78.2491 154.856L118.5 181M144.999 111.5L118.499 105L78.2489 131.143L37.9989 105L11.4989 111.5M144.999 111.5V120.5L103.431 147.5M144.999 111.5L96.5026 143L103.431 147.5M11.4989 111.5V120.5L53.0672 147.499M11.4989 111.5L59.9953 142.999L53.0672 147.499M118.5 181L144.999 174.5M118.5 181V190M144.999 174.5V183.5L118.5 190M144.999 174.5L103.431 147.5M37.9985 190L78.2491 163.856L118.5 190" fill="black"/>
        </g>
      </svg>
    </div>
  );
};

export default Sidebar;
