import { useTranslation } from 'react-i18next';
import data from '../model/data/posts.json';
import styles from './ChangesPage.module.scss';
import { icons, SvgIcon } from '@/shared/ui';
import { IPost } from '../model/types/post.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Namespaces } from '@/shared/config/i18n/i18n.ts';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';

const posts: IPost[] = data;

const getClassByTag = (tag: string) => {
  switch (tag) {
    case 'UI/UX':
      return 'ui';
    case 'Функциональность':
      return 'functional';
    case 'Багфикс':
      return 'bugfix';
    default:
      return null;
  }
};

const ChangesPage = () => {
  const { t } = useTranslation(Namespaces.CHANGELOG);
  const { openSidebar } = useSidebar();

  return (
    <>
      <div className={styles.header}>
        <SvgIcon
          iconName={icons.MENU}
          className={styles.iconSidebar}
          onClick={openSidebar}
        />

        {t('История обновлений сайта') as string}
        <SvgIcon
          iconName={icons.CHANGES}
          important
          applyHover={false}
          className={styles.icon}
        />
      </div>

      <div className={styles.posts}>
        {posts.map((post, index) => (
          <div className={styles.post} key={post.date}>
            <div className={styles.date}>
              {t(post.date) as string}
            </div>

            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <div
                  className={classNames(styles.tag, [styles[getClassByTag(tag)]])}
                  key={tag + index}
                >
                  {t(tag) as string}
                </div>
              ))}
            </div>

            <ul className={styles.changes}>
              {post.changes.map((change) => (
                <li className={styles.change} key={change + index}>
                  {t(change) as string}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChangesPage;
