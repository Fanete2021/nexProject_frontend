import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover } from '@mui/material';
import { icons, SvgIcon } from '@/shared/ui';
import styles from './LanguageSwitcher.module.scss';
import { LOCAL_STORAGE_LANGUAGE_KEY } from '@/shared/config/i18n/i18n.ts';

const LanguageSwitcher = memo(() => {
    const { i18n } = useTranslation();

    const toggle = (language: string) => {
        i18n.changeLanguage(language, (err) => {
            if (language === 'ru') {
                i18n.options.fallbackLng = ['ru'];
            } else {
                i18n.options.fallbackLng = ['en'];
            }

            localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
        });
    };

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const openPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const closePopover = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const open = Boolean(anchorEl);

    return (
        <>
            <button className={styles.iconWrapper} onClick={openPopover}>
                <SvgIcon
                    iconName={icons.LANGUAGE}
                    important
                />
            </button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                classes={{
                    paper: styles.popover
                }}
            >
                <button
                    onClick={() => toggle('ru')}
                    className={styles.flagWrapper}
                >
                    <SvgIcon iconName={icons.RU} className={`${i18n.language !== 'ru' && styles.disabledFlag}`}/>
                </button>
                <button
                    onClick={() => toggle('en')}
                    className={styles.flagWrapper}
                >
                    <SvgIcon iconName={icons.EN} className={`${i18n.language !== 'en' && styles.disabledFlag}`}/>
                </button>
            </Popover>
        </>
    );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';
export default LanguageSwitcher;
