import { useTranslation } from 'react-i18next';
import { AuthenticatedPageLayout } from '@/widgets/authenticated-page-layout';
import { ThemeSwitcher } from '@/widgets/theme-switcher';
import { LanguageSwitcher } from '@/widgets/language-switcher';
import { icons, SvgIcon } from '@/shared/ui';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';

const MainPage = () => {
  const { t } = useTranslation();
  const { openSidebar } = useSidebar();

  return (
    <AuthenticatedPageLayout>
      <ThemeSwitcher />
      <LanguageSwitcher />

      <SvgIcon
        iconName={icons.MENU}
        onClick={openSidebar}
      />
    </AuthenticatedPageLayout>
  );
};

export default MainPage;
