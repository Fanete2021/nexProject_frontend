import React, { useCallback } from 'react';
import { CustomInput, icons, SvgIcon } from '@/shared/ui';
import { InputAdornment } from '@mui/material';
import styles from './Search.module.scss';
import { useTranslation } from 'react-i18next';

export interface SearchProps {
  value: string;
  changeValue: (value: string) => void;
}

const Search: React.FC<SearchProps> = (props) => {
  const { t } = useTranslation();
  const { value, changeValue } = props;

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
        root: styles.searchWrapper,
        input: styles.searchInput
      }}
      value={value}
      onChange={changeHandler}
    />
  );
};

export default Search;
