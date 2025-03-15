import React from 'react';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import styles from './CustomInput.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface CustomInputProps extends OutlinedInputProps {
    isError?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ isError, classes,...props }) => {
    return (
        <OutlinedInput
            {...props}
            classes={{
                root: classNames(styles.wrapperInput, [classes?.root]),
                notchedOutline: classNames(isError ? styles.error : styles.notchedOutline, [classes?.notchedOutline]),
                input: classNames(styles.input, [classes?.input])
            }}
        />
    );
};

export default CustomInput;
