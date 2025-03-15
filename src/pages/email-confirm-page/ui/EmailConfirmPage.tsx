import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { GuestPageLayout } from '@/widgets/GuestPageLayout';
import styles from './EmailConfirmPage.module.scss';
import { EmailConfirmForm } from '@/features/confirmEmail';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import {classNames} from "@/shared/lib/utils/classNames.ts";

const EmailConfirmPage = () => {
    const { t } = useTranslation();
    const user = useSelector(getUserData);

    console.log(user);

    return (
        <GuestPageLayout
            title={'Пожалуйста, проверьте вашу электронную почту'}
        >
            <div className={styles.subtitle}>
                {t('Мы отправили код на')} <strong>{user?.email}</strong>
            </div>

            <EmailConfirmForm />

            <Link
                to={RoutePath.auth}
                className={classNames(styles.guestLink, ['guestLink'])}
            >
                {t('Вернуться назад')}
            </Link>
        </GuestPageLayout>
    );
};

export default EmailConfirmPage;
