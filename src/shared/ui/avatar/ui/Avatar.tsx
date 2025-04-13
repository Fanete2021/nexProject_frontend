import React, { memo, useMemo } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './Avatar.module.scss';
import { formatText } from '@/shared/ui/avatar/utils/formatText.ts';

export interface AvatarProps {
    src?: string; 
    text?: string;
    width?: number;
    height?: number;
    className?: string;
}


const Avatar: React.FC<AvatarProps> = memo((props) => {
  const { src, text, width = 50, height = 50, className } = props;

  const fontSize = useMemo(() => {
    return Math.min(width, height) / 3;
  }, [width, height]);

  const initials = useMemo(() => formatText(text), [text]);

  if (src) {
    return (
      <img
        src={src}
        alt="avatar"
        className={styles.image}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <div
      className={classNames(styles.avatar, [styles.text, className])}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${fontSize}px`,
      }}
    >
      {initials}
    </div>
  );
});

Avatar.displayName = 'Avatar';
export default Avatar;

