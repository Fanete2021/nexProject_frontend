import React, { useCallback } from 'react';
import { ChatInfo } from '../../../../model/types/chatInfo.ts';
import styles from './Header.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Avatar, icons, SvgIcon } from '@/shared/ui';
import { useSelector } from 'react-redux';
import { getChatIsActiveInfoPanel } from '../../../../model/selectors/getChatIsActiveInfoPanel.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { chatActions } from '../../../../model/slice/chatSlice.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { isPublicChat } from '@/shared/lib/utils/isPublicChat.ts';

export interface HeaderProps {
  chatInfo: ChatInfo;
  className?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { chatInfo, className } = props;
  const isActiveInfoPanel = useSelector(getChatIsActiveInfoPanel);
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  const toggleInfoPanel = () => {
    dispatch(chatActions.setIsActiveInfoPanel(!isActiveInfoPanel));
  };

  const clearSelectedChat = useCallback(() => {
    dispatch(chatActions.setSelectedChat(undefined));
  }, []);

  return (
    <div className={classNames(styles.Header, [className])}>
      <SvgIcon
        iconName={icons.BACK}
        important
        className={styles.iconBack}
        onClick={clearSelectedChat}
      />

      <div className={styles.chatInfo}>
        <Avatar
          text={chatInfo.chatName}
          height={windowWidth > MOBILE_MAX_BREAKPOINT ? 50 : 40}
          width={windowWidth > MOBILE_MAX_BREAKPOINT ? 50 : 40}
          className={styles.avatar}
        />

        <div className={styles.info}>
          <div className={styles.name}>
            {isPublicChat(chatInfo) &&
              <SvgIcon
                iconName={icons.GROUP}
                className={styles.iconPublic}
                applyHover={false}
                important
              />
            }

            <span>
              {chatInfo.chatName}
            </span>
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

        <svg preserveAspectRatio="xMidYMid meet" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 19L11.5 11.5M13 7C13 8.5913 12.3679 10.1174 11.2426 11.2426C10.1174 12.3679 8.5913 13 7 13C5.4087 13 3.88258 12.3679 2.75736 11.2426C1.63214 10.1174 1 8.5913 1 7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7Z" stroke-width="1.5" stroke="black"/>
        </svg>

        <SvgIcon
          iconName={icons.PHONE}
          className={styles.icon}
          important
        />

        <SvgIcon
          iconName={icons.INFO_PANEL}
          className={styles.iconInfoPanel}
          onClick={toggleInfoPanel}
          important={isActiveInfoPanel}
        />
      </div>
    </div>
  );
};

export default Header;
