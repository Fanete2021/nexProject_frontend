import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { icons, Popover, SvgIcon } from '@/shared/ui';
import styles from './LanguageSwitcher.module.scss';
import { LOCAL_STORAGE_LANGUAGE_KEY } from '@/shared/config/i18n/i18n.ts';
import { usePopover } from '@/shared/lib/hooks/usePopover.ts';

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

  const { anchorEl, openPopover, isOpenPopover, closePopover } = usePopover();

  return (
    <>
      <button className={styles.iconWrapper} onClick={openPopover}>
        <SvgIcon
          iconName={icons.LANGUAGE}
          important
        />
      </button>

      <Popover
        open={isOpenPopover}
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
