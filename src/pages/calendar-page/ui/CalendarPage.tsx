import React from 'react';
import { PageLayout } from '@/widgets/PageLayout';
import { useTranslation } from 'react-i18next';

const CalendarPage = () => {
    const { t } = useTranslation();

    return (
        <PageLayout>
            <>
                {t('Матвей гений!')}
            </>
        </PageLayout>
    );
};

export default CalendarPage;
