import React, { useMemo, useState } from 'react';
import styles from './Sidebar.module.scss';
import {icons, Logo, SvgIcon} from '@/shared/ui';
import { SidebarItemsList } from '../model/items.ts';
import { Link, useLocation } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface SidebarProps {
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
    const { className } = props;

    const { t } = useTranslation();
    const [ expanded, setExpanded ] = useState<boolean>(false);
    const location = useLocation();

    const mods: Record<string, boolean> = {
        [styles.expanded]: expanded,
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
                    {t(item.text)}
                </div>
            }
        </Link>
    )), [expanded, t, location]);

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
                            {t('Настройки')}
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
                            {t('Изменения')}
                        </div>
                    }
                </Link>

                <Link to={RoutePath.auth} className={styles.linkWrapper}>
                    <SvgIcon
                        className={classNames(styles.icon,[styles.applyIconFill])}
                        iconName={icons.LOGOUT}
                    />

                    {expanded &&
                        <div className={styles.text}>
                            {t('Выйти')}
                        </div>
                    }
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
