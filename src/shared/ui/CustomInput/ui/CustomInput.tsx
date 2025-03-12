import React from 'react';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import styles from './CustomInput.module.scss';

export type CustomInputProps = OutlinedInputProps

const CustomInput: React.FC<CustomInputProps> = (props) => {
    const { classes } = props;
  
    return (
        <OutlinedInput
            {...props}
            classes={{
                root: styles.wrapperInput,
                notchedOutline: styles.notchedOutline,
                input: styles.input,
                ...classes
            }}
        />
    );
};

export default CustomInput;
