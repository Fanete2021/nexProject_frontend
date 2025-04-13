import styles from './DialogItem.module.scss';
import { Skeleton } from '@mui/material';
import React from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface DialogItemSkeletonProps {
  className?: string;
}

const DialogItemSkeleton: React.FC<DialogItemSkeletonProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames(styles.DialogItemSkeleton, [className])}>
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
};

export default DialogItemSkeleton;
