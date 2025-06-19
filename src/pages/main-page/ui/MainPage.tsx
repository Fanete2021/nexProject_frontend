import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from '@/widgets/theme-switcher';
import { LanguageSwitcher } from '@/widgets/language-switcher';
import { icons, SvgIcon } from '@/shared/ui';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const { t } = useTranslation();
  const { openSidebar } = useSidebar();

  return (
    <>
      <ThemeSwitcher />
      <LanguageSwitcher />
      <Link
        to={RoutePath.testApi}
      >
        Тест 
      </Link>

      <SvgIcon
        iconName={icons.MENU}
        onClick={openSidebar}
      />
    </>
  );
};

export default MainPage;
