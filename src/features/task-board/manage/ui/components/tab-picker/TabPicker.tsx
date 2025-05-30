import React from 'react';
import { Tabs, tabs } from './model/tabs';
import { convertObjectToArray } from '@/shared/lib/utils/convertObjectToArray.ts';
import styles from './TabPicker.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { SvgIcon } from '@/shared/ui';

export interface TabPickerProps {
  currentTab: Tabs;
  changeTab: (newTab: Tabs) => void;
}

export const tabsArray = convertObjectToArray(tabs);

const TabPicker: React.FC<TabPickerProps> = (props) => {
  const { currentTab, changeTab } = props;

  const onClickHandler = (newTab: Tabs) => {
    changeTab(newTab);
  };
  
  return (
    <div className={styles.TabPicker}>
      {tabsArray.map((tab) => (
        <div
          key={tab.id}
          className={classNames(styles.tab, [], {
            [styles.selected]: currentTab === tab.id
          })}
          onClick={() => onClickHandler(tab.id)}
        >
          <SvgIcon
            iconName={tab.icon}
            applyHover={false}
            applyFill={tab.id !== Tabs.PANEL_KANBAN}
            applyStroke={tab.id === Tabs.PANEL_KANBAN}
            className={styles.icon}
            important={currentTab === tab.id}
          />

          <span className={styles.title}>
            {tab.title}
          </span>
        </div>
      ))
      }
    </div>
  );
};

export default TabPicker;
