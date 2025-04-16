import { useTranslation } from 'react-i18next';
import { AuthenticatedPageLayout } from '@/widgets/authenticated-page-layout';
import { icons, SvgIcon } from '@/shared/ui';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';

const TeamsPage = () => {
  const { t } = useTranslation();
  const { openSidebar } = useSidebar();
  
  return (
    <AuthenticatedPageLayout>
      <SvgIcon
        iconName={icons.MENU}
        onClick={openSidebar}
      />
    </AuthenticatedPageLayout>
  );
};

export default TeamsPage;
