import React from 'react';
import { ChatInfo } from '../../../../model/types/chatInfo.ts';
import styles from './Header.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Avatar, icons, SvgIcon } from '@/shared/ui';
import { useSelector } from 'react-redux';
import { getChatIsActiveInfoPanel } from '../../../../model/selectors/getChatIsActiveInfoPanel.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { chatActions } from '../../../../model/slice/chatSlice.ts';

export interface HeaderProps {
  chatInfo: ChatInfo;
  className?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { chatInfo, className } = props;
  const isActiveInfoPanel = useSelector(getChatIsActiveInfoPanel);
  const dispatch = useAppDispatch();

  const toggleInfoPanel = () => {
    dispatch(chatActions.setIsActiveInfoPanel(!isActiveInfoPanel));
  };

  return (
    <div className={classNames(styles.Header, [className])}>
      <div className={styles.chatInfo}>
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

      <div className={styles.actions}>
        <SvgIcon
          iconName={icons.SEARCH}
          applyStroke
          applyFill={false}
          className={styles.icon}
          important
        />

        <SvgIcon
          iconName={icons.PHONE}
          className={styles.icon}
          important
        />

        <SvgIcon
          iconName={icons.INFO_PANEL}
          className={styles.icon}
          onClick={toggleInfoPanel}
          important={isActiveInfoPanel}
        />
      </div>
    </div>
  );
};

export default Header;
