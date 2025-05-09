import React, { useState } from 'react';
import { VideoTranscription } from '@/entities/video-transcription';
import { Modal, Scrollbar } from '@/shared/ui';
import styles from './Transcriptions.module.scss';

export interface TranscriptionsProps {
  transcriptions: VideoTranscription[];
}

const Transcriptions: React.FC<TranscriptionsProps> = (props) => {
  const { transcriptions } = props;

  const [selectedTranscription, setSelectedTranscription] = useState<VideoTranscription | null>(null);

  const closeModal = () => {
    setSelectedTranscription(null);
  };

  return (
    <Scrollbar>
      <span>Переведенные звонки:</span>
      
      {transcriptions.map((transcription, index) => (
        <div 
          key={transcription.summarizationId}
          className={styles.transcription}
          onClick={() => setSelectedTranscription(transcription)}
        >
          {index}
        </div>
      ))}

      <Modal
        isOpen={Boolean(selectedTranscription)}
        onClose={closeModal}
      >
        <div className={styles.summarizationText}>
          {selectedTranscription?.summarizationText}
        </div>
      </Modal>
    </Scrollbar>
  );
};

export default Transcriptions;
