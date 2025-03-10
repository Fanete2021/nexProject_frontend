import React from 'react';
import { AuthenticatedPageLayout } from '@/widgets/PageLayout';
import { useTranslation } from 'react-i18next';

const TeamsPage = () => {
    const { t } = useTranslation();

    return (
        <AuthenticatedPageLayout>
            <>
                {t('Матвей гений!')}
            </>
        </AuthenticatedPageLayout>
    );
};

export default TeamsPage;
