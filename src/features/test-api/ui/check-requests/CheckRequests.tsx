import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './CheckRequests.module.scss';
import { checkWithToken } from '../../model/service/checkWithToken';
import { checkWithoutToken } from '../../model/service/checkWithoutToken';
import { Button, CircleLoader } from '@/shared/ui';

const CheckRequests = () => {
  const dispatch = useAppDispatch();

  const [responseWithToken, setResponseWithToken] = useState<string>('');
  const [responseWithoutToken, setResponseWithoutToken] = useState<string>('');

  const [isLoadingWithToken, setIsLoadingWithToken] = useState<boolean>(false);
  const [isLoadingWithoutToken, setIsLoadingWithoutToken] = useState<boolean>(false);

  const checkWithTokenHandler = useCallback(async () => {
    try {
      setIsLoadingWithToken(true);
      const response = await dispatch(checkWithToken()).unwrap();
      setResponseWithToken(response);
    } catch (error) {
      setResponseWithToken(error.errDetails);
    } finally {
      setIsLoadingWithToken(false);
    }
  }, []);

  const checkWithoutTokenHandler = useCallback(async () => {
    try {
      setIsLoadingWithoutToken(true);
      const response = await dispatch(checkWithoutToken()).unwrap();
      setResponseWithoutToken(response);
    } catch (error) {
      setResponseWithoutToken(error.errDetails);
    } finally {
      setIsLoadingWithoutToken(false);
    }
  }, []);
  
  return (
    <div className={styles.CheckRequests}>
      <div className={styles.title}>Тестовые запросы</div>

      <div className={styles.testWrapper}>
        <Button className={styles.button} onClick={checkWithTokenHandler}>
          {isLoadingWithToken
            ? <CircleLoader />
            : 'С токеном'
          }
        </Button>

        {responseWithToken &&
          <div className={styles.response}>- {responseWithToken}</div>
        }
      </div>

      <div className={styles.testWrapper}>
        <Button className={styles.button} onClick={checkWithoutTokenHandler}>
          {isLoadingWithoutToken
            ? <CircleLoader />
            : 'Без токена'
          }
        </Button>

        {responseWithoutToken &&
          <div className={styles.response}>- {responseWithoutToken}</div>
        }
      </div>
    </div>
  );
};

export default CheckRequests;
