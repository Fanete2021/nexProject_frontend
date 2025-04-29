import { useState, useCallback, useEffect, useRef } from 'react';

interface UseResizablePanelParams {
  minWidth: number;
  maxWidth: number;
  initialWidth: number;
  direction: 'left' | 'right';
  containerRef: React.RefObject<HTMLElement>;
}

export const useResizablePanel = (props: UseResizablePanelParams) => {
  const { containerRef, direction, maxWidth, minWidth, initialWidth } = props;

  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);
  const startPos = useRef(0);
  const startWidth = useRef(initialWidth);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth: number;

      if (direction === 'left') {
        newWidth = e.clientX - containerRect.left;
      } else {
        newWidth = containerRect.right - e.clientX;
      }

      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      setWidth(newWidth);
    },
    [minWidth, maxWidth, direction, containerRef]
  );

  const stopResize = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
  }, [handleMouseMove]);

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      startPos.current = e.clientX;
      startWidth.current = width;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResize);
    },
    [width, handleMouseMove, stopResize]
  );

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResize);
    };
  }, [handleMouseMove, stopResize]);

  return { width, startResize };
};
