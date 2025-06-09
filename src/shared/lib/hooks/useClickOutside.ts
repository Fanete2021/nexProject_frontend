import { useEffect, RefObject } from 'react';

const useClickOutside = (
  ref: RefObject<HTMLElement>,
  isVisible: boolean,
  onClose: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node) && isVisible) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    if (isVisible) {
      document.body.style.pointerEvents = 'none';
      if (ref.current) {
        ref.current.style.pointerEvents = 'auto';
      }
    } else {
      document.body.style.pointerEvents = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.pointerEvents = 'auto';
    };
  }, [ref, isVisible, onClose]);
};

export default useClickOutside;
