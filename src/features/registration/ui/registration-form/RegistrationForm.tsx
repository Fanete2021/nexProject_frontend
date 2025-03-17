import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useTranslation } from 'react-i18next';
import { registration } from '@/features/registration/ui/model/service/registration.ts';
import { CustomInput, icons, SvgIcon, ValidationList, ValidationListItem } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { isPasswordValid, isUsernameValid } from '@/shared/lib/utils/validation.ts';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';

const validationSchema = yup.object({
    email: yup.string().email('Почта невалидна').required('Почта обязательна'),
    username: yup.string()
        .required('Имя пользователя обязательно')
        .matches(/^[a-zA-Z0-9-_]{3,15}$/,'Не соответствует шаблону'),
    password: yup.string()
        .required('Пароль обязателен')
        .matches(/^[a-zA-Z0-9!@#$%^&*]{6,15}$/, 'Не соответствует шаблону'),
    confirmPassword: yup.string()
        .required('Подтверждение пароля обязательно')
        .oneOf([yup.ref('password')], 'Пароли не совпадают'),
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
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                await dispatch(registration(values)).unwrap();
            } catch (error) {
                setError(error);
            }
        },
    });

    const {
        usernameLengthValid,
        usernameLengthValidText,
        usernameStartsWithLetter,
        usernameStartsWithLetterText,
        usernameCharsValid,
        usernameCharsValidText
    } = isUsernameValid(formik.values.username);
    const usernameValidationListItems: ValidationListItem[] = [
        {
            text: usernameLengthValidText,
            isError: !usernameLengthValid
        },
        {
            text: usernameStartsWithLetterText,
            isError: !usernameStartsWithLetter
        },
        {
            text: usernameCharsValidText,
            isError: !usernameCharsValid
        },
    ];

    const {
        passwordLengthValid,
        passwordLengthValidText,
        passwordCharsValid,
        passwordCharsValidText
    } = isPasswordValid(formik.values.password);
    const passwordValidationListItems: ValidationListItem[] = [
        {
            text: passwordLengthValidText,
            isError: !passwordLengthValid
        },
        {
            text: passwordCharsValidText,
            isError: !passwordCharsValid
        },
    ];

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
        <form className="form" onSubmit={onSubmit}>
            {error &&
                <div className="error">{error}</div>
            }

            <FormControl
                fullWidth
                className="FieldWrapper"
            >
                <div className="label">
                    {t('Почта')}<br/>
                    {isFormikErrorVisible(formik, 'email') &&
                        <div className="error">{t(formik.errors.email)}</div>
                    }
                </div>

                <CustomInput
                    endAdornment={
                        <InputAdornment position="end">
                            <SvgIcon
                                className="emailIcon"
                                iconName={icons.EMAIL}
                                applyHover={false}
                                important={false}
                            />
                        </InputAdornment>
                    }
                    id="email"
                    placeholder={t('Почта')}
                    fullWidth
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isError={isFormikErrorVisible(formik, 'email')}
                    onBlur={formik.handleBlur}
                />
            </FormControl>

            <FormControl
                fullWidth
                className="FieldWrapper"
            >
                <div className="label">
                    {t('Имя пользователя')} <br/>
                    {isFormikErrorVisible(formik, 'username') &&
                        <div className="error">{t(formik.errors.username)}</div>
                    }
                </div>

                <ValidationList items={usernameValidationListItems} isError={Boolean(formik.errors.username)}>
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
                        isError={isFormikErrorVisible(formik, 'username')}
                        autoComplete={'off'}
                        onBlur={formik.handleBlur}
                        type="text"
                    />
                </ValidationList>
            </FormControl>

            <FormControl
                fullWidth
                className="FieldWrapper"
            >
                <div className="label">
                    {t('Пароль')}<br/>
                    {isFormikErrorVisible(formik,'password') &&
                        <div className="error">{t(formik.errors.password)}</div>
                    }
                </div>

                <ValidationList items={passwordValidationListItems} isError={Boolean(formik.errors.password)}>
                    <CustomInput
                        endAdornment={
                            <button type="button" onClick={handleClickShowPassword} className="showPassword">
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
                        isError={isFormikErrorVisible(formik, 'password')}
                        onBlur={formik.handleBlur}
                    />
                </ValidationList>
            </FormControl>

            <FormControl
                fullWidth
                className="FieldWrapper"
            >
                <div className="label">
                    {t('Подтверждение пароля')}<br/>
                    {isFormikErrorVisible(formik, 'confirmPassword') &&
                        <div className="error">{t(formik.errors.confirmPassword)}</div>
                    }
                </div>
                <CustomInput
                    endAdornment={
                        <button type="button" onClick={handleClickShowConfirmPassword} className="showError">
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
                    isError={isFormikErrorVisible(formik, 'confirmPassword')}
                    onBlur={formik.handleBlur}
                />
            </FormControl>

            <button
                className="submit"
                type={'submit'}
                onClick={onSubmit}
            >
                {t('Создать')}
            </button>
        </form>
    );
};

export default RegistrationForm;
