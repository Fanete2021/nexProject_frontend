import { ChangePasswordForm } from '@/features/change-password';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PasswordChangePage = () => {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  
  return (
    <>
      <div className='title'>
        {t('Смена пароля') as string}
      </div>
      
      <ChangePasswordForm token={token || ''}/>
    </>
  );
};

export default PasswordChangePage;
