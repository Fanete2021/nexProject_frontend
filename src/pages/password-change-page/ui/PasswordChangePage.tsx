import { GuestPageLayout } from '@/widgets/GuestPageLayout';
import { ChangePasswordForm } from '@/features/change-password';
import {useParams} from "react-router-dom";

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
