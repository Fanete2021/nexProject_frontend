import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}

export default useWindowWidth;
