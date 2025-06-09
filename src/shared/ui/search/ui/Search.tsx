import React, { useCallback } from 'react';
import { CustomInput, icons, SvgIcon } from '@/shared/ui';
import { InputAdornment } from '@mui/material';
import styles from './Search.module.scss';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface SearchProps {
  value: string;
  changeValue: (value: string) => void;
  classes?: {
    searchWrapper?: string;
    searchInput?: string;
  }
}

const Search: React.FC<SearchProps> = (props) => {
  const { t } = useTranslation();
  const { value, changeValue, classes } = props;

  const clearSearch = useCallback(() => {
    changeValue('');
  }, [changeValue]);

  const changeHandler = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeValue(e.target.value);
  }, [changeValue]);

  return (
    <CustomInput
      startAdornment={
        <InputAdornment position="start">
          <SvgIcon
            iconName={icons.SEARCH}
            applyHover={false}
            important={Boolean(value)}
            applyStroke
            applyFill={false}
            className={styles.iconSearch}
          />
        </InputAdornment>
      }
      endAdornment={value &&
        <InputAdornment position="end">
          <SvgIcon
            iconName={icons.CROSS}
            applyHover={false}
            important={Boolean(value)}
            applyStroke
            className={styles.iconClearSearch}
            onClick={clearSearch}
          />
        </InputAdornment>
      }
      placeholder={t('Поиск') as string}
      fullWidth
      classes={{
        root: classNames(styles.searchWrapper, [classes?.searchWrapper]),
        input: classNames(styles.searchInput, [classes?.searchInput])
      }}
      value={value}
      onChange={changeHandler}
    />
  );
};

export default Search;
