import React, { useCallback } from 'react';
import styles from './Header.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { icons, SvgIcon } from '@/shared/ui';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { chatActions } from '../../../../../../model/slice/chatSlice.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { Skeleton } from '@mui/material';

export interface HeaderSkeletonProps {
  className?: string;
}

const HeaderSkeleton: React.FC<HeaderSkeletonProps> = (props) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  const clearSelectedChat = useCallback(() => {
    dispatch(chatActions.setSelectedChat(undefined));
  }, []);

  return (
    <div className={classNames(styles.Header, [className])}>
      <SvgIcon
        iconName={icons.ARROW}
        important
        className={styles.iconBack}
        onClick={clearSelectedChat}
      />

      <div className={styles.chatInfo} style={{ width: '100%' }}>
        <Skeleton
          variant="circular"
          width={windowWidth > MOBILE_MAX_BREAKPOINT ? 50 : 40}
          height={windowWidth > MOBILE_MAX_BREAKPOINT ? 50 : 40}
          classes={{ root: classNames('skeleton', [styles.avatar]) }}
          animation='wave'
        />

        <div className={styles.info} style={{ width: '100%' }}>
          <Skeleton
            variant="text"
            width={'30%'}
            classes={{ root: 'skeleton' }}
            animation='wave'
          />

          <Skeleton
            variant="text"
            width={'10%'}
            classes={{ root: 'skeleton' }}
            animation='wave'
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;
