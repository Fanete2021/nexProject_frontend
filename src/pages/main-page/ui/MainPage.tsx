import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticatedPageLayout } from '@/widgets/authenticated-page-layout';
import { ThemeSwitcher } from '@/widgets/theme-switcher';
import { LanguageSwitcher } from '@/widgets/language-switcher';

const MainPage = () => {
  const { t } = useTranslation();

  return (
    <AuthenticatedPageLayout>
      <ThemeSwitcher />
      <LanguageSwitcher />
    </AuthenticatedPageLayout>
  );
};

export default MainPage;
