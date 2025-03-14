import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './LoginForm.module.scss';
import { login } from '@/features/auth/model/service/login.ts';
import { useTranslation } from 'react-i18next';
import { CustomCheckbox, CustomInput, icons, SvgIcon } from '@/shared/ui';
import {useCallback, useEffect, useState} from 'react';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import {Link, useNavigate} from 'react-router-dom';
import { getInputType } from '@/shared/lib/utils/getInputType.ts';
import {useSelector} from "react-redux";

const validationSchema = yup.object({
    phoneNumberOrMail: yup.string()
        .required('Почта или телефон обязателены')
        .test('isValidPhoneOrEmail', 'Введите корректное значение', (value) => {
            return Boolean(getInputType(value));
        }),
    password: yup.string().required('Пароль обязателен'),
});

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>('');
    const d = useSelector(state => state.auth);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            phoneNumberOrMail: '',
            password: '',
            rememberMe: false
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(login(values)).unwrap();
                navigate(RoutePath.main);
            } catch (error) {
                setError(error);
            }
        },
    });

    const isShowError = (field: string): boolean => {
        return (formik.touched[field] || formik.submitCount > 0) && Boolean(formik.errors[field]);
    };

    const currentInputType = getInputType(formik.values.phoneNumberOrMail);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        formik.handleSubmit();
    }, [formik.handleSubmit]);

    const handleClickShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {error &&
              <div className={styles.error}>{error}</div>
            }

            <FormControl
                fullWidth
                className={styles.FieldWrapper}
            >
                <div className={styles.label}>
                    {t('Почта / телефон')}<br/>
                    {isShowError('phoneNumberOrMail') &&
                        <div className={styles.error}>{t(formik.errors.phoneNumberOrMail)}</div>
                    }
                </div>

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
                    isError={isShowError('phoneNumberOrMail')}
                    onBlur={formik.handleBlur}
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.FieldWrapper}
            >
                <div className={styles.label}>
                    {t('Пароль')}<br/>
                    {isShowError('password') &&
                        <div className={styles.error}>{t(formik.errors.password)}</div>
                    }
                </div>

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
                    isError={isShowError('password')}
                    onBlur={formik.handleBlur}
                />
            </FormControl>

            <div className={styles.rememberForgot}>
                <CustomCheckbox
                    name="rememberMe"
                    label={'Оставаться в системе'}
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
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
