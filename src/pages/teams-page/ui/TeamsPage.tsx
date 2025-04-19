import { useTranslation } from 'react-i18next';
import { icons, SvgIcon } from '@/shared/ui';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';

const TeamsPage = () => {
  const { t } = useTranslation();
  const { openSidebar } = useSidebar();
  
  return (
    <>
      <SvgIcon
        iconName={icons.MENU}
        onClick={openSidebar}
      />
    </>
  );
};

export default TeamsPage;
