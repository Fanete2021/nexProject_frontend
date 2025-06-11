import styles from './TestApiPage.module.scss';
import { Chat, CheckRequests } from '@/features/test-api';
import { Tabs } from '@/shared/ui';
import { useState } from 'react';
import Moootvey from '@/shared/assets/images/moootvey.png';

enum TabTypes {
  REQUESTS = 'REQUESTS',
  CHAT = 'CHAT',
}

const tabs = [
  {
    name: 'Запросы',
    value: TabTypes.REQUESTS,
  },
  {
    name: 'Чат',
    value: TabTypes.CHAT,
  }
];

const TestApiPage = () => {
  const [currentTab, setCurrentTab] = useState<TabTypes>(TabTypes.REQUESTS);

  return (
    <div className={styles.TestApiPage}>
      <div className={styles.header}>
        <img src={Moootvey} className={styles.moootvey} alt="radnoy"/>
        
        <Tabs
          value={currentTab}
          onChange={(value) => setCurrentTab(value as TabTypes)}
          items={tabs}
          className={styles.tabs}
        />
      </div>

      <div className={styles.content}>
        {currentTab === TabTypes.REQUESTS &&
          <CheckRequests />
        }

        {currentTab === TabTypes.CHAT &&
          <Chat />
        }
      </div>
    </div>
  );
};

export default TestApiPage;
