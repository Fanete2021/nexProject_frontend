import React from 'react';
import styles from './Filter.module.scss';
import { CheckList, icons, Search, SvgIcon } from '@/shared/ui';

export interface FilterProps {
  searchedMember: string;
  setSearcherMember: (newValue: string) => void;
  selectedRoles: { label: string, value: boolean }[];
  setSelectedRoles: (newValues: { label: string, value: boolean }[]) => void;
}

const Filter: React.FC<FilterProps> = (props) => {
  const {
    searchedMember,
    setSearcherMember,
    selectedRoles,
    setSelectedRoles
  } = props;

  return (
    <div className={styles.Filter}>
      <div className={styles.header}>
        Фильтры

        <SvgIcon
          iconName={icons.FILTER}
          applyFill={false}
          applyHover={false}
          important={Boolean(searchedMember) || selectedRoles.filter(role => !role.value).length > 0}
          applyStroke
          className={styles.iconFilter}
        />
      </div>

      <Search
        value={searchedMember}
        changeValue={setSearcherMember}
        classes={{
          searchWrapper: styles.searchWrapper
        }}
      />

      <div className={styles.roles}>
        <div className={styles.title}>
          Отображаемые роли:
        </div>

        <CheckList
          items={selectedRoles}
          onChange={setSelectedRoles}
        />
      </div>
    </div>
  );
};

export default Filter;
