import { useState, useCallback } from 'react';

export const usePopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openPopover = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closePopover = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const isOpenPopover = Boolean(anchorEl);

  return {
    anchorEl,
    openPopover,
    closePopover,
    isOpenPopover,
  };
};
