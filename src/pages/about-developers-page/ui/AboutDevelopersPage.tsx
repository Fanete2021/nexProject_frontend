import { GuestPageLayout } from '@/widgets/guest-page-layout';
import { developers } from '../model/developers.ts';
import styles from './AboutDevelopersPage.module.scss';
import { useTranslation } from 'react-i18next';
import { icons, SvgIcon } from '@/shared/ui';
import { Namespaces } from '@/shared/config/i18n/i18n.ts';

const AboutDevelopersPage = () => {
  const { t } = useTranslation(Namespaces.ABOUT_DEVELOPERS);

  return (
    <GuestPageLayout title={'Создатели платформы'}>
      <div className={styles.developers}>
        {developers.map(developer => (
          <div key={developer.name} className={styles.developer}>
            <div className={styles.name}>
              {t(developer.name) as string}
            </div>

            <div className={styles.photoWrapper}>
              <img
                className={styles.photo}
                src={developer.photo}
                alt={t(developer.name) as string}
              />
            </div>

            <div className={styles.roles}>
              {developer.roles.map((role, index) => (
                <span key={role + index} className={styles.role}>
                  {t(role) as string}
                </span>
              ))}
            </div>

            <div className={styles.description}>
              {developer.description.map((text, i) => (
                <p key={text + i} className={styles.text}>
                  {t(text) as string}
                </p>
              ))}
            </div>

            <div className={styles.links}>
              <a href={developer.telegram} target='_blank' rel="noreferrer">
                <SvgIcon
                  iconName={icons.TELEGRAM}
                  important
                  applyFill={false}
                  applyHover
                  applyStroke
                  className={styles.link}
                />
              </a>
              <a href={developer.github} target='_blank' rel="noreferrer">
                <SvgIcon
                  iconName={icons.GITHUB}
                  important
                  className={styles.link}
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </GuestPageLayout>
  );
};

export default AboutDevelopersPage;
