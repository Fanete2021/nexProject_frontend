import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChangePasswordForm } from '@/features/account/change-password';

const NewPasswordPage = () => {
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

export default NewPasswordPage;
