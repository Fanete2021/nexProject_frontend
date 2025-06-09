import React, { useCallback } from 'react';
import { ChatInfo } from '../../../../../../model/types/chatInfo.ts';
import styles from './Header.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Avatar, icons, SvgIcon } from '@/shared/ui';
import { useSelector } from 'react-redux';
import { getChatIsActiveInfoPanel } from '../../../../../../model/selectors/getChatIsActiveInfoPanel.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { chatActions } from '../../../../../../model/slice/chatSlice.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { videoActions } from '@/features/video';
import { isPublicChat } from '../../../../../../utils/libs/isPublicChat.ts';
import {RoutePath} from "@/shared/config/routeConfig/routeConfig.tsx";
import {useNavigate} from "react-router-dom";

export interface HeaderProps {
  chatInfo: ChatInfo;
  className?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { chatInfo, className } = props;

  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();

  const isActiveInfoPanel = useSelector(getChatIsActiveInfoPanel);

  const isPublic = isPublicChat(chatInfo);

  const toggleInfoPanel = () => {
    dispatch(chatActions.setIsActiveInfoPanel(!isActiveInfoPanel));
  };

  const clearSelectedChat = useCallback(() => {
    dispatch(chatActions.setSelectedChat(undefined));
    navigate(`${RoutePath.chats}`);
  }, [navigate]);
  
  const videoCallHandler = () => {
    dispatch(videoActions.setRoomId(chatInfo.chatId));
  };

  return (
    <div className={classNames(styles.Header, [className])}>
      <SvgIcon
        iconName={icons.ARROW}
        important
        className={styles.iconBack}
        onClick={clearSelectedChat}
      />

      <div
        className={styles.chatInfo}
        onClick={windowWidth <= MOBILE_MAX_BREAKPOINT ? toggleInfoPanel : undefined}
      >
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

          {isPublic
            ?
            <div className={styles.members}>
              {chatInfo.members.length} members
            </div>
            :
            <div className={styles.online}>
              заходил 1 мин.назад
            </div>
          }
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
          onClick={videoCallHandler}
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
