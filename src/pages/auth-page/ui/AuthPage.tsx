import {icons, SvgIcon} from "@/shared/ui";
import styles from './AuthPage.module.scss';
import {LoginForm} from "@/features/auth";
import {ThemeSwitcher} from "@/widgets/ThemeSwitcher";
import {useTranslation} from "react-i18next";
import {LanguageSwitcher} from "@/widgets/LanguageSwitcher";

const AuthPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.AuthPage}>
      <div className={styles.settings}>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className={styles.container}>
        <SvgIcon
          className={styles.logo}
          iconName={icons.LOGO}
          important
          applyStroke
          applyFill={false}
          applyHover={false}
        />

        <div className={styles.title}>
          {t('Вход')}
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

export default AuthPage
