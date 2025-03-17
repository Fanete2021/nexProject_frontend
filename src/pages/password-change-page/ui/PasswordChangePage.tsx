import { ChangePasswordForm } from '@/features/change-password';
import { useParams } from 'react-router-dom';
import { GuestPageLayout } from '@/widgets/guest-page-layout';

const PasswordChangePage = () => {
    const { token } = useParams<{ token: string }>();

    return (
        <GuestPageLayout
            title={'Смена пароля'}
        >
            <ChangePasswordForm token={token || ''}/>
        </GuestPageLayout>
    );
};

export default PasswordChangePage;
