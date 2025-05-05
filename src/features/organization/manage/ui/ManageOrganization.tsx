import styles from './ManageOrganization.module.scss';
import { getOrganizationSelectedOrganization, OrganizationPicker } from '@/entities/organization';
import TabPicker from './components/tab-picker/TabPicker.tsx';
import { useSelector } from 'react-redux';
import { Tabs } from './components/tab-picker/model/tabs.ts';
import { useCallback, useEffect, useState } from 'react';
import Members from './components/members/Members.tsx';
import { SidebarOpener } from '@/widgets/sidebar-opener';

const ManageOrganization = () => {
  const selectedOrganization = useSelector(getOrganizationSelectedOrganization);
  
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.MEMBERS);

  useEffect(() => {
    setCurrentTab(Tabs.MEMBERS);
  }, [selectedOrganization]);
  
  const changeTab = useCallback((tab: Tabs) => {
    setCurrentTab(tab);
  }, []);
  
  return (
    <div className={styles.ManageOrganization}>
      <div className={styles.header}>
        <SidebarOpener className={styles.sidebarOpener}/>
        
        <OrganizationPicker />

        { selectedOrganization && 
          <TabPicker 
            currentTab={currentTab}
            changeTab={changeTab}
          /> 
        }
      </div>

      {selectedOrganization &&
        <div className={styles.content}>
          {currentTab === Tabs.MEMBERS && <Members />}
        </div>
      }
    </div>
  );
};

export default ManageOrganization;
