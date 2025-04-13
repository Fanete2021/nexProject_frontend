import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticatedPageLayout } from '@/widgets/authenticated-page-layout';

const NotificationsPage = () => {
  const { t } = useTranslation();

  return (
    <AuthenticatedPageLayout>
    </AuthenticatedPageLayout>
  );
};

export default NotificationsPage;
