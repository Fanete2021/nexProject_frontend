import { useSelector } from 'react-redux';
import { getMyRoleInOrganization, OrganizationInfo } from '@/entities/organization';
import { getUserData } from '@/entities/user';
import { usePopover } from '@/shared/lib/hooks/usePopover.ts';
import styles from './TabPicker.module.scss';
import { Arrow, ArrowDirections, Popover, SvgIcon } from '@/shared/ui';
import { tabs, Tabs } from './model/tabs.ts';

export interface TabPickerProps {
  currentTab: Tabs;
  changeTab: (newTab: Tabs) => void;
  selectedOrganization: OrganizationInfo;
}

export const tabsArray = Object.entries(tabs).map(([key, value]) => ({
  id: key as Tabs,
  ...value
}));

const TabPicker: React.FC<TabPickerProps> = (props) => {
  const { currentTab, changeTab, selectedOrganization } = props;

  const user = useSelector(getUserData)!;

  const myRole = getMyRoleInOrganization(selectedOrganization, user);

  const { anchorEl, openPopover, isOpenPopover, closePopover } = usePopover();

  const onClickHandler = (newTab: Tabs) => {
    closePopover();
    changeTab(newTab);
  };

  return (
    <>
      <div className={styles.tab} onClick={openPopover}>
        <div className={styles.iconWrapper}>
          <SvgIcon
            iconName={tabs[currentTab].icon}
            applyHover={false}
            className={styles.icon}
          />
        </div>

        <span className={styles.title}>
          {tabs[currentTab].title}
        </span>

        <Arrow
          className={styles.iconArrow}
          direction={isOpenPopover ? ArrowDirections.UP : ArrowDirections.DOWN}
        />
      </div>

      <Popover
        open={isOpenPopover}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        classes={{
          paper: styles.popover
        }}
      >
        {tabsArray
          .map((tab) => (
            <div
              key={tab.id}
              className={styles.tab}
              onClick={() => onClickHandler(tab.id)}
            >
              <div className={styles.iconWrapper}>
                <SvgIcon
                  iconName={tab.icon}
                  applyHover={false}
                  className={styles.icon}
                />
              </div>

              <span className={styles.title}>
                {tab.title}
              </span>
            </div>
          ))}
      </Popover>
    </>
    
  );
};

export default TabPicker;
