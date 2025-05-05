import styles from './DialogItem.module.scss';
import { Skeleton } from '@mui/material';
import React from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';

export interface DialogItemSkeletonProps {
  className?: string;
}

const DialogItemSkeleton: React.FC<DialogItemSkeletonProps> = (props) => {
  const { className } = props;
  const windowWidth = useWindowWidth();

  return (
    <div className={classNames(styles.DialogItemSkeleton, [className])}>
      <Skeleton
        variant="circular"
        width={windowWidth > MOBILE_MAX_BREAKPOINT ? 40 : 50}
        height={windowWidth > MOBILE_MAX_BREAKPOINT ? 40 : 50}
        classes={{ root: 'skeleton' }}
        animation='wave'
      />

      <div className={styles.info}>
        <Skeleton
          variant="text"
          width={'100%'}
          classes={{ root: 'skeleton' }}
          animation='wave'
        />

        <Skeleton
          variant="text"
          width={'100%'}
          classes={{ root: 'skeleton' }}
          animation='wave'
        />
      </div>
    </div>
  );
};

export default DialogItemSkeleton;
