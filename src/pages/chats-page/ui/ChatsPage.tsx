import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChatPanel } from '@/features/chat';
import styles from './ChatPage.module.scss';

const ChatsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <ChatPanel className={styles.chat}/>
    </>
  );
};

export default ChatsPage;
