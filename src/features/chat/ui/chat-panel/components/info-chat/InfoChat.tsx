import styles from './InfoChat.module.scss';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { icons, SvgIcon } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { chatActions } from '../../../../model/slice/chatSlice.ts';
import React, { useEffect, useState } from 'react';
import GroupMembers from './components/group-members/GroupMembers.tsx';
import { fetchVideoTranscriptions, VideoTranscription } from '@/entities/video-transcription';
import Transcriptions from './components/transcriptions/Transcriptions.tsx';
import { isPublicChat } from '../../../../utils/libs/isPublicChat.ts';

export interface InfoChatProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
}

const InfoChat: React.FC<InfoChatProps> = (props) => {
  const { className, ...rest } = props;
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const selectedChat = useSelector(getChatSelectedChat)!;
  
  const isPublic = isPublicChat(selectedChat);
  
  const [transcriptions, setTranscription] = useState<VideoTranscription[]>([]);
  
  const closeInfoChat = () => {
    dispatch(chatActions.setIsActiveInfoPanel(false));
  };

  useEffect(() => {
    const setupTranscriptipons = async () => {
      try {
        const response = await dispatch(fetchVideoTranscriptions({
          chatId: selectedChat.chatId
        }));

        setTranscription(response.payload);
      } catch (e) {
        console.error(e);
      }
    };

    if (isPublic) {
      setTranscription([]);
    } else {
      setupTranscriptipons();
    }
  }, [selectedChat]);

  return (
    <div className={classNames(styles.InfoChat, [className])} {...rest}>
      <div className={styles.header}>
        <SvgIcon
          iconName={icons.ARROW}
          important
          className={styles.iconBack}
          onClick={closeInfoChat}
        />

        {t('Информация о чате') as string}

        <SvgIcon
          iconName={icons.INFO}
          important
          applyHover={false}
          className={styles.iconInfo}
        />
      </div>

      {isPublic &&
        <GroupMembers />
      }

      {!isPublic && transcriptions && <Transcriptions transcriptions={transcriptions} />}
    </div>
  );
};

export default InfoChat;
