import {icons, SvgIcon} from "@/shared/ui";
import styles from './AuthPage.module.scss';
 import {LoginForm} from "@/features/auth";

const AuthPage = () => {
  return (
    <div className={styles.AuthPage}>
      <div className={styles.container}>
        <SvgIcon className={styles.logo} iconName={icons.LOGO} />

        <div className={styles.title}>
          Вход
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

export default AuthPage
