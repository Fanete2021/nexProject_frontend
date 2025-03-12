import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './RegistrationForm.module.scss';
import { useTranslation } from 'react-i18next';
import { registration } from '@/features/registration/ui/model/service/registration.ts';
import { CustomInput, icons, SvgIcon } from '@/shared/ui';
import { useCallback, useState } from 'react';

const validationSchema = yup.object({
    email: yup.string().required('Почта обязателены'),
    username: yup.string().required('Имя пользовтеля обязателено'),
    password: yup.string().required('Пароль обязателен'),
    confirmPassword: yup.string().required('Подтверждение пароля обязателено'),
});

const RegistrationForm = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string>('');


    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(registration(values)).unwrap();
            } catch (error) {
                setError(error);
            }
        },
    });

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        formik.handleSubmit();
    }, [formik.handleSubmit]);

    const handleClickShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleClickShowConfirmPassword = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {error &&
                <div className={styles.error}>{error}</div>
            }

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Почта')}</div>
                <CustomInput
                    endAdornment={
                        <InputAdornment position="end">
                            <SvgIcon
                                className={styles.emailIcon}
                                iconName={icons.EMAIL}
                                applyHover={false}
                                important={false}
                            />
                        </InputAdornment>
                    }
                    id="email"
                    placeholder={t('Почта')}
                    fullWidth
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Имя пользователя')}</div>
                <CustomInput
                    endAdornment={
                        <InputAdornment position="end">
                            <SvgIcon
                                iconName={icons.USERNAME}
                                applyHover={false}
                                important={false}
                            />
                        </InputAdornment>
                    }
                    id="username"
                    placeholder={t('Имя пользователя')}
                    fullWidth
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Пароль')}</div>
                <CustomInput
                    endAdornment={
                        <button type="button" onClick={handleClickShowPassword} className={styles.showPassword}>
                            <SvgIcon
                                iconName={showPassword ? icons.PASSWORD : icons.PASSWORD_OFF}
                                applyHover={false}
                                important={false}
                            />
                        </button>
                    }
                    id="password"
                    placeholder={t('Пароль')}
                    fullWidth
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    type={showPassword ? 'text' : 'password'}
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Подтверждение пароля')}</div>
                <CustomInput
                    endAdornment={
                        <button type="button" onClick={handleClickShowConfirmPassword} className={styles.showPassword}>
                            <SvgIcon
                                iconName={showConfirmPassword ? icons.PASSWORD : icons.PASSWORD_OFF}
                                applyHover={false}
                                important={false}
                            />
                        </button>
                    }
                    id="confirmPassword"
                    placeholder={t('Повторите пароль')}
                    fullWidth
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    type={showConfirmPassword ? 'text' : 'password'}
                />
            </FormControl>

            <button
                className={styles.submit}
                type={'submit'}
                onClick={onSubmit}
            >
                {t('Создать')}
            </button>
        </form>
    );
};

export default RegistrationForm;
