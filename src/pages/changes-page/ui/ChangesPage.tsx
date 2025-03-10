import React, { useState } from 'react';
import { AuthenticatedPageLayout } from '@/widgets/AuthenticatedPageLayout';
import { useTranslation } from 'react-i18next';
import data from '../model/data/posts.json';
import { IPost } from '../model/types/post.ts';
import styles from './ChangesPage.module.scss';

const posts: IPost[] = data;

const ChangesPage = () => {
    const { t } = useTranslation();

    const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

    const resetSelectedPost = () => {
        setSelectedPost(null);
    };

    if (!selectedPost) {
        return (
            <AuthenticatedPageLayout>
                <ul className={styles.postsList}>
                    {posts.map(post => (
                        <li className={styles.title} key={post.id}>
                            <button onClick={() => setSelectedPost(post)}>
                                {t(post.title)}
                            </button>
                        </li>
                    ))}
                </ul>
            </AuthenticatedPageLayout>
        );
    }

    return (
        <AuthenticatedPageLayout>
            <div className={styles.header}>
                <button
                    onClick={() => resetSelectedPost()}
                    className={styles.back}
                >
                    ←
                </button>

                <div className={styles.title}>
                    {t(selectedPost.title)}
                </div>
            </div>

            <ul className={styles.changesList}>
                {selectedPost.changes?.map(change => (
                    <li className={styles.change} key={change}>
                        {t(change)}
                    </li>
                ))}
            </ul>
        </AuthenticatedPageLayout>
    );
};

export default ChangesPage;
