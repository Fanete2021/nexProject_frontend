import { useEffect, useRef } from 'react';

export const useAppContainerRef = () => {
  const appContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    appContainerRef.current = document.querySelector('.app');
  }, []);
  
  return appContainerRef;
};
