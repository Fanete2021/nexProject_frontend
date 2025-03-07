import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Popover} from "@mui/material";
import {icons, SvgIcon} from "@/shared/ui";
import styles from "./LanguageSwitcher.module.scss";

export const LanguageSwitcher = memo((props) => {
  const { i18n } = useTranslation();

  const toggle = (language: string) => {
    // i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru');
    i18n.changeLanguage(language);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

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
