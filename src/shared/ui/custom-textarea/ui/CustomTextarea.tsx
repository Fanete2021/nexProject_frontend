import React, { useRef, useEffect, TextareaHTMLAttributes, useState } from 'react';
import styles from './CustomTextarea.module.scss';
import { classNames } from '@/shared/lib/utils/classNames';
import { Scrollbar } from '@/shared/ui';
import { TextareaAutosize, TextareaAutosizeProps } from '@mui/material';

export interface CustomTextareaProps extends TextareaHTMLAttributes<TextareaAutosizeProps> {
  isError?: boolean;
  classes?: {
    wrapper?: string;
    textarea?: string;
  },
  maxHeight?: number;
}

const PADDING_TOP = 14;
const PADDING_BOTTOM = 13;

const CustomTextarea: React.FC<CustomTextareaProps> = (props) => {
  const {
    isError,
    value,
    classes,
    maxHeight = 200,
    ...rest
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current && scrollWrapperRef.current) {
      const element = textareaRef.current;

      console.log(element.scrollHeight);

      const newHeight = Math.min(element.scrollHeight, maxHeight);
      scrollWrapperRef.current.style.height = `${newHeight + PADDING_TOP + PADDING_BOTTOM + 1}px`;
    }
  }, [value, maxHeight]);

  return (
    <>
      <div
        ref={scrollWrapperRef}
        className={classNames(styles.wrapper, [classes?.wrapper])}
        style={{ maxHeight: `${maxHeight}px`, paddingTop: `${PADDING_TOP}px`, paddingBottom: `${PADDING_BOTTOM}px` }}
      >
        <Scrollbar>
          <TextareaAutosize
            ref={textareaRef}
            {...rest}
            value={value}
            className={classNames(
              styles.input,
              [classes?.textarea]
            )}
          />
        </Scrollbar>
      </div>
    </>

  );
};

export default CustomTextarea;
