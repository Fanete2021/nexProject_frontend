import { useFormik } from 'formik';
import * as yup from 'yup';
import { Checkbox, FormControl, FormControlLabel, InputAdornment, OutlinedInput } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './LoginForm.module.scss';
import { login } from '@/features/auth/ui/model/service/login.ts';
import { useTranslation } from 'react-i18next';
import { CustomCheckbox, icons, SvgIcon } from '@/shared/ui';
import { useState } from 'react';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { Link } from 'react-router-dom';

const validationSchema = yup.object({
    phoneNumberOrMail: yup.string().required('Почта или телефон обязателены'),
    password: yup.string().required('Пароль обязателен'),
});

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            phoneNumberOrMail: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(login(values));
            } catch (error) {
                console.error(error);
            }
        },
    });

    const onSubmit = (e) => {
        e.preventDefault();
        formik.handleSubmit();
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Почта / телефон')}</div>
                <OutlinedInput
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
                    id="phoneNumberOrMail"
                    placeholder={t('Почта или телефон')}
                    fullWidth
                    name="phoneNumberOrMail"
                    classes={{
                        root: styles.wrapperInput,
                        notchedOutline: styles.notchedOutline,
                        input: styles.input
                    }}
                    value={formik.values.phoneNumberOrMail}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Пароль')}</div>
                <OutlinedInput
                    endAdornment={
                        <InputAdornment position="end">
                            <button type="button" onClick={handleClickShowPassword} className={styles.showPassword}>
                                <SvgIcon
                                    iconName={showPassword ? icons.PASSWORD : icons.PASSWORD_OFF}
                                    applyHover={false}
                                    important={false}
                                />
                            </button>
                        </InputAdornment>
                    }
                    id="password"
                    placeholder={t('Пароль')}
                    fullWidth
                    name="password"
                    classes={{
                        root: styles.wrapperInput,
                        notchedOutline: styles.notchedOutline,
                        input: styles.input,
                    }}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    type={showPassword ? 'text' : 'password'}
                />
            </FormControl>

            <div className={styles.rememberForgot}>
                <CustomCheckbox 
                    label={'Оставаться в системе'}
                />

                <Link to={RoutePath.registration} className={styles.forgot}>
                    {t('Забыли пароль?')}
                </Link>
            </div>

            <button
                className={styles.submit}
                type={'submit'}
                onClick={onSubmit}
            >
                {t('Войти')}
            </button>
        </form>
    );
};

export default LoginForm;
