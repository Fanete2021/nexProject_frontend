import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@/shared/ui';
import styles from './VideoCallModal.module.scss';
import { useSelector } from 'react-redux';
import { getAuthToken } from '@/features/auth';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { getVideoRoomId } from '../../model/selectors/getVideoRoomId.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { videoActions } from '../../model/slice/videoSlice.ts';
import WebRtcService from '../../model/service/WebRtcService.ts';

const VideoCallModal = () => {
  const token = useSelector(getAuthToken);
  const { userId } = useSelector(getUserData)!;
  const roomId = useSelector(getVideoRoomId);
  const dispatch = useAppDispatch();
  
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  
  const onCloseModal = useCallback(() => {
    setIsOpen(false);
    WebRtcService.leaveRoom();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      dispatch(videoActions.resetRoomId());
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(Boolean(roomId));
  }, [roomId]);

  useEffect(() => {
    if (roomId && isOpen) {
      WebRtcService.initialize(token, userId, roomId, onParticipantsUpdate);
    }
  }, [roomId, isOpen]);

  const onParticipantsUpdate = (participant: HTMLDivElement) => {
    if (container.current) {
      container.current.appendChild(participant);
    }
  };

  if (!roomId) {
    return;
  }
  
  return (
    <Modal
      onClose={onCloseModal}
      isOpen={isOpen}
    >
      <div className={styles.VideoCallModal} ref={container}>

      </div>
    </Modal>
  );
};

export default VideoCallModal;
