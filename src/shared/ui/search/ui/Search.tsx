import React from 'react';
import { CustomInput, icons, SvgIcon } from '@/shared/ui';
import { InputAdornment } from '@mui/material';
import styles from './Search.module.scss';

export interface SearchProps {
  value: string;
  clearSearch?: () => void;
  searchHandler?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Search: React.FC<SearchProps> = (props) => {
  const { value, clearSearch, searchHandler } = props;

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
            className={styles.clearSearch}
            onClick={clearSearch}
          />
        </InputAdornment>
      }
      placeholder="Search"
      fullWidth
      classes={{
        root: styles.searchWrapper,
        input: styles.searchInput
      }}
      value={value}
      onChange={searchHandler}
    />
  );
};

export default Search;
