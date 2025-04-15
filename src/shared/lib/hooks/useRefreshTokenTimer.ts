import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { refreshToken } from '@/features/auth';

const useRefreshTokenTimer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshToken()).unwrap().catch((error) => {
        console.error('Ошибка при обновлении токена:', error);
      });
    }, 14 * 60 * 1000);  //14 минут, токен действует 15 минут 14*60*1000

    return () => clearInterval(interval);
  }, [dispatch]);
};

export default useRefreshTokenTimer;
