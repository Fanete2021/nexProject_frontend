import React, { useCallback, useState } from 'react';
import { GuestPageLayout } from '@/widgets/guest-page-layout';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { checkWithoutToken, checkWithToken } from '@/features/test-api';
import styles from './TestApiPage.module.scss';

const AboutDevelopersPage = () => {
    const dispatch = useAppDispatch();
    const [responseWithToken, setResponseWithToken] = useState<string>('');
    const [responseWithoutToken, setResponseWithoutToken] = useState<string>('');

    const checkWithTokenHandler = useCallback(async () => {
        try {
            const response = await dispatch(checkWithToken()).unwrap();
            setResponseWithToken(response);
        } catch (error) {
            setResponseWithToken(error.errDetails);
        }
    }, []);

    const checkWithoutTokenHandler = useCallback(async () => {
        try {
            const response = await dispatch(checkWithoutToken()).unwrap();
            setResponseWithoutToken(response);
        } catch (error) {
            setResponseWithoutToken(error.errDetails);
        }
    }, []);

    return (
        <GuestPageLayout title={'Тест Api'}>
            <div className={styles.testWrapper}>
                <div className={styles.response}>{responseWithToken}</div>
                <button className={styles.button} onClick={checkWithTokenHandler}>С токеном</button>
            </div>

            <div className={styles.testWrapper}>
                <div className={styles.response}>{responseWithoutToken}</div>
                <button className={styles.button} onClick={checkWithoutTokenHandler}>Без токена</button>
            </div>
        </GuestPageLayout>
    );
};

export default AboutDevelopersPage;
