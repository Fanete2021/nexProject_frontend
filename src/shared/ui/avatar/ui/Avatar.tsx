import React, { memo, useMemo, useRef, useEffect } from 'react';
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
  const { src, text, width, height, className } = props;
  const avatarRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => formatText(text), [text]);

  useEffect(() => {
    if (avatarRef.current) {
      const avatarElement = avatarRef.current;
      const avatarWidth = avatarElement.offsetWidth;
      const avatarHeight = avatarElement.offsetHeight;
      const fontSize = Math.min(avatarWidth, avatarHeight) / 3;
      avatarElement.style.fontSize = `${fontSize}px`;
    }
  }, [width, height, text]);

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
      ref={avatarRef}
      className={classNames(styles.avatar, [styles.text, className])}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {initials}
    </div>
  );
});

Avatar.displayName = 'Avatar';
export default Avatar;
