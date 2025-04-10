import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticatedPageLayout } from '@/widgets/authenticated-page-layout';
import { ChatPanel } from '@/features/chat';
import styles from './ChatPage.module.scss';

const ChatsPage = () => {
    const { t } = useTranslation();

    return (
        <AuthenticatedPageLayout>
            <ChatPanel className={styles.chat}/>
        </AuthenticatedPageLayout>
    );
};

export default ChatsPage;
