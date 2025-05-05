import React, { useEffect, useRef } from 'react';
import styles from './Messages.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Scrollbar } from '@/shared/ui';
import { Skeleton } from '@mui/material';
import { Scrollbars } from 'react-custom-scrollbars-2';

export interface MessagesSkeletonProps {
  className?: string;
}

const MessagesSkeleton: React.FC<MessagesSkeletonProps> = (props) => {
  const { className } = props;
  const scrollbarRef = useRef<Scrollbars>(null);

  useEffect(() => {
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollToBottom();
    }
  }, [scrollbarRef]);

  return (
    <div className={className}>
      <Scrollbar ref={scrollbarRef}>
        <div className={styles.Messages}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={styles.messageGroup}
            >
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                classes={{ root: classNames('skeleton', [styles.avatar]) }}
                animation='wave'
              />

              <div className={styles.messages}>
                <Skeleton
                  variant="rounded"
                  width={Math.random() * 120 + 60}
                  height={40}
                  animation='wave'
                  classes={{ root: classNames('skeleton', [styles.message]) }}
                />

                <Skeleton
                  variant="rounded"
                  width={Math.random() * 120 + 60}
                  height={40}
                  animation='wave'
                  classes={{ root: classNames('skeleton', [styles.message]) }}
                />
              </div>
            </div>
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

export default MessagesSkeleton;
