import styles from './DialogItem.module.scss';
import { Skeleton } from '@mui/material';
import React, { HTMLAttributes } from 'react';

const DialogItemSkeleton = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  return (
    <div ref={ref} {...props} className={styles.DialogItem}>
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        classes={{
          root: styles.skeleton
        }}
        animation='wave'
      />

      <div className={styles.info}>
        <Skeleton
          variant="text"
          width={'100%'}
          classes={{
            root: styles.skeleton
          }}
          animation='wave'
        />

        <Skeleton
          variant="text"
          width={'100%'}
          classes={{
            root: styles.skeleton
          }}
          animation='wave'
        />
      </div>
    </div>
  );
});

DialogItemSkeleton.displayName = 'DialogItemSkeleton';
export default DialogItemSkeleton;
