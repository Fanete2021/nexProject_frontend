import React, { useState } from 'react';
import { VideoTranscription } from '@/entities/video-transcription';
import { Modal, Scrollbar } from '@/shared/ui';
import styles from './Transcriptions.module.scss';

export interface TranscriptionsProps {
  transcriptions: VideoTranscription[];
}

const formatTextToComponents = (text: string) => {
  if (!text) return null;

  // Разбиваем текст на строки
  return text.split('\n').map((line, i) => {
    // Обрабатываем жирный текст (**текст**)
    if (line.includes('**')) {
      const boldParts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i}>
          {boldParts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      );
    }
    // Обрабатываем маркированный список (начинается с -)
    else if (line.trim().startsWith('-')) {
      return <li key={i}>{line.trim().substring(1).trim()}</li>;
    }
    // Обычный текст
    return <div key={i}>{line}</div>;
  });
};

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
          <ul>
            {formatTextToComponents(selectedTranscription?.summarizationText || '')}
          </ul>
        </div>
      </Modal>
    </Scrollbar>
  );
};

export default Transcriptions;
