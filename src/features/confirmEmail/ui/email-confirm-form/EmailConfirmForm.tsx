import { useFormik } from 'formik';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './EmailConfirmForm.module.scss';
import { useTranslation } from 'react-i18next';
import { CustomInput } from '@/shared/ui';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const EmailConfirmForm = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [error, setError] = useState<string>('');
    const [timer, setTimer] = useState<number>(0); // Таймер в секундах
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false); // Активен ли таймер
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const formik = useFormik({
        initialValues: {
            confirmCode: ['', '', '', ''],
        },
        onSubmit: async (values) => {
            try {
                const confirmCode = { code: values.confirmCode.join('') };
                setError('error');
                // await dispatch(confirmEmail(confirmCode)).unwrap();
            } catch (error) {
                setError(error);
            }
        },
    });

    const startTimer = useCallback(() => {
        setIsTimerActive(true);
        setTimer(60);
    }, []);

    const sendCode = useCallback(() => {
        startTimer();
    }, [startTimer]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
        }

        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const handleInputChange = useCallback(
        (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length > 1) return;

            const newValues = [...formik.values.confirmCode];
            newValues[index] = value;
            formik.setFieldValue('confirmCode', newValues);

            if (value && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }

            if (newValues.every((char) => char)) {
                formik.handleSubmit();
            }
        },
        [formik]
    );

    const handleKeyDown = useCallback(
        (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Backspace' && !formik.values.confirmCode[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        },
        [formik.values.confirmCode]
    );

    return (
        <>
            <div className={styles.wrapperCode}>
                {formik.values.confirmCode.map((value, index) => (
                    <CustomInput
                        key={index}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        value={value}
                        onChange={handleInputChange(index)}
                        onKeyDown={handleKeyDown(index)}
                        classes={{
                            root: styles.wrapperInput,
                            input: styles.input,
                        }}
                        maxLength={1}
                        isError={Boolean(error)}
                    />
                ))}
            </div>

            {error &&
                <div className={styles.error}>{t('Неверный код')}</div>
            }

            <div className={styles.sendCodeWrapper}>
                {isTimerActive
                    ?
                    <div className={styles.timer}>
                        {t('Отправить код повторно') + ` (${formatTime(timer)})`}
                    </div>
                    :
                    <button
                        className={styles.sendCode}
                        onClick={sendCode}
                    >
                        {t('Я не получил(а) код')}
                    </button>
                }
            </div>
        </>
    );
};

export default EmailConfirmForm;
