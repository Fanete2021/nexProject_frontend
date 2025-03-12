import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './LoginForm.module.scss';
import { login } from '@/features/auth/ui/model/service/login.ts';
import { useTranslation } from 'react-i18next';
import { CustomCheckbox, CustomInput, icons, SvgIcon } from '@/shared/ui';
import { useState } from 'react';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { Link } from 'react-router-dom';
import { getInputType } from '@/shared/lib/utils/getInputType.ts';

const validationSchema = yup.object({
    phoneNumberOrMail: yup.string().required('Почта или телефон обязателены'),
    password: yup.string().required('Пароль обязателен'),
});

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>('');

    const formik = useFormik({
        initialValues: {
            phoneNumberOrMail: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(login(values)).unwrap();
            } catch (error) {
                setError(error);
            }
        },
    });

    const currentInputType = getInputType(formik.values.phoneNumberOrMail);

    const onSubmit = (e) => {
        e.preventDefault();
        formik.handleSubmit();
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {error &&
              <div className={styles.error}>{error}</div>
            }

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Почта / телефон')}</div>
                <CustomInput
                    endAdornment={
                        currentInputType && (
                            <InputAdornment position="end">
                                <SvgIcon
                                    className={currentInputType === 'email' && styles.emailIcon}
                                    iconName={
                                        currentInputType === 'email'
                                            ? icons.EMAIL
                                            : icons.PHONE
                                    }
                                    applyHover={false}
                                    important={false}
                                />
                            </InputAdornment>
                        )
                    }
                    id="phoneNumberOrMail"
                    placeholder={t('Почта или телефон')}
                    fullWidth
                    name="phoneNumberOrMail"
                    value={formik.values.phoneNumberOrMail}
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
