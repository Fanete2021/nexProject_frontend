import React from 'react';
import { AuthenticatedPageLayout } from '@/widgets/AuthenticatedPageLayout';
import { useTranslation } from 'react-i18next';

const DocsPage = () => {
    const { t } = useTranslation();

    return (
        <AuthenticatedPageLayout>
            <>
                {t('Матвей гений!')}
            </>
        </AuthenticatedPageLayout>
    );
};

export default DocsPage;
