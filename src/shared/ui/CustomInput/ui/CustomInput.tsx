import React from 'react';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import styles from './CustomInput.module.scss';

export interface CustomInputProps extends OutlinedInputProps {
  isError?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = (props) => {
    const { classes, isError } = props;

    return (
        <OutlinedInput
            {...props}
            classes={{
                root: styles.wrapperInput,
                notchedOutline: isError ? styles.error : styles.notchedOutline,
                input: styles.input,
                ...classes
            }}
        />
    );
};

export default CustomInput;
