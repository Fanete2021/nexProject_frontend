import React from 'react';
import { ChatInfo } from '../../../../model/types/chatInfo.ts';
import styles from './Header.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Avatar } from '@/shared/ui';

export interface HeaderProps {
  chatInfo: ChatInfo;
  className?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { chatInfo, className } = props;

  return (
    <div className={classNames(styles.Header, [className])}>
      <Avatar
        text={chatInfo.chatName}
        width={50}
        height={50}
      />

      <div className={styles.info}>
        <div className={styles.name}>
          {chatInfo.chatName}
        </div>

        <div className={styles.online}>
          заходил 1 мин.назад
        </div>
      </div>
    </div>
  );
};

export default Header;
