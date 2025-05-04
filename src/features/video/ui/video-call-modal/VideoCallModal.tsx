import { useCallback, useEffect, useRef, useState } from 'react';
import { icons, Modal, SvgIcon } from '@/shared/ui';
import styles from './VideoCallModal.module.scss';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { getVideoRoomId } from '../../model/selectors/getVideoRoomId.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { videoActions } from '../../model/slice/videoSlice.ts';
import WebRtcService, { participantsUpdateActions } from '../../model/service/WebRtcService.ts';
import { participant } from '../../model/types/participant.ts';
import { getAuthToken } from '@/features/account/auth';

const VideoCallModal = () => {
  const token = useSelector(getAuthToken)!;
  const { userId } = useSelector(getUserData)!;
  const roomId = useSelector(getVideoRoomId);
  const dispatch = useAppDispatch();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoCount, setVideoCount] = useState(0);

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
    WebRtcService.leaveRoom();
  }, []);

  const toggleVideo = useCallback(() => {
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);
    WebRtcService.updateVideoTrack(newState);
  }, [isVideoEnabled]);

  const toggleAudio = useCallback(() => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    WebRtcService.updateAudioTrack(newState);
  }, [isAudioEnabled]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(videoActions.resetRoomId());
      setIsVideoEnabled(false);
      setIsAudioEnabled(true);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(Boolean(roomId));
  }, [roomId]);

  useEffect(() => {
    if (roomId && isOpen) {
      WebRtcService.connect(roomId);
    }
  }, [roomId, isOpen]);

  useEffect(() => {
    WebRtcService.initialize(token, userId, onParticipantsUpdate, () => setIsOpen(false));
  }, []);

  const onParticipantsUpdate = (participant: participant, action: participantsUpdateActions) => {
    if (containerRef.current) {
      const { video } = participant;

      if (action === participantsUpdateActions.ADD) {
        video.classList.add(styles.videoItem);
        containerRef.current.appendChild(video);

        setVideoCount(prev => prev + 1);
      }

      if (action === participantsUpdateActions.REMOVE) {
        const videoElement = containerRef.current.querySelector(`#video-${participant.userId}`);
        if (videoElement) {
          containerRef.current.removeChild(videoElement);
          setVideoCount(prev => prev - 1);
        }
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const videos = Array.from(container.children) as HTMLElement[];
    const count = videos.length;

    if (count === 0) return;

    let rows, cols;

    if (count <= 1) {
      rows = cols = 1;
    } else if (count === 2) {
      rows = 1;
      cols = 2;
    } else if (count <= 4) {
      rows = cols = 2;
    } else if (count <= 6) {
      rows = 2;
      cols = 3;
    } else {
      rows = Math.ceil(Math.sqrt(count));
      cols = Math.ceil(count / rows);
    }

    videos.forEach(video => {
      video.style.width = `${100 / cols}%`;
      video.style.height = `${100 / rows}%`;
      video.style.minWidth = '0';
      video.style.flex = '1 1 auto';
    });
  }, [videoCount]);

  if (!roomId) {
    return;
  }
  
  return (
    <Modal isOpen={isOpen}>
      <div className={styles.VideoCallModal}>
        <div className={styles.header}>
          <div className={styles.title}>Название</div>

          <button className={styles.rollUp}>
            <SvgIcon iconName={icons.LINE} important/>
          </button>
        </div>

        <div className={styles.main}>
          <div className={styles.video} ref={containerRef} />
        </div>

        <div className={styles.footer}>
          <div className={styles.actions}>
            <div className={styles.video}>
              <SvgIcon
                iconName={isVideoEnabled ? icons.CAMERA : icons.CAMERA_OFF}
                className={styles.icon}
                applyFill={false}
                applyStroke={true}
                important
                onClick={toggleVideo}
              />
              <span className={styles.text}>Video</span>
            </div>
            <div className={styles.audio}>
              <SvgIcon
                iconName={isAudioEnabled ? icons.MICROPHONE : icons.MICROPHONE_OFF}
                className={styles.icon}
                applyFill={false}
                applyStroke={true}
                important
                onClick={toggleAudio}
              />

              <span className={styles.text}>Mute</span>
            </div>
            <div className={styles.leave}>
              <SvgIcon
                iconName={icons.PHONE}
                className={styles.icon}
                important
                onClick={onCloseModal}
              />

              <span className={styles.text}>Leave</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VideoCallModal;
