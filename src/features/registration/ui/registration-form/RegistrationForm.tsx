import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './RegistrationForm.module.scss';
import { useTranslation } from 'react-i18next';
import { registration } from '@/features/registration/ui/model/service/registration.ts';
import { CustomInput, icons, SvgIcon } from '@/shared/ui';
import { memo, useCallback, useState } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';

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

const isUsernameValid = (username) => {
    const lengthValid = username.length >= 3 && username.length <= 15;
    const charsValid = /^[a-zA-Z0-9-_]+$/.test(username);
    const startsWithLetter = /^[a-zA-Z]/.test(username);
    return { lengthValid, charsValid, startsWithLetter };
};

const isPasswordValid = (password) => {
    const lengthValid = password.length >= 6 && password.length <= 15;
    const charsValid = /^[a-zA-Z0-9!@#$%^&*]+$/.test(password);
    return { lengthValid, charsValid };
};

const CheckIcon = memo(() => (
    <div className={styles.iconWrapper}>
        <SvgIcon
            iconName={icons.CHECK}
            important
            applyFill={false}
            applyStroke
            applyHover={false}
            className={styles.icon}
        />
    </div>
));

CheckIcon.displayName = 'CheckIcon';

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
        lengthValid: usernameLengthValid,
        charsValid: usernameCharsValid,
        startsWithLetter: usernameStartsWithLetter
    } = isUsernameValid(formik.values.username);
    const {
        lengthValid: passwordLengthValid,
        charsValid: passwordCharsValid
    } = isPasswordValid(formik.values.password);

    const isShowError = (field: string): boolean => {
        return (formik.touched[field] || formik.submitCount > 0) && Boolean(formik.errors[field]);
    };

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
                className={styles.FieldWrapper}
            >
                <div className={styles.label}>
                    {t('Почта')}<br/>
                    {isShowError('email') &&
                        <div className={styles.error}>{t(formik.errors.email)}</div>
                    }
                </div>

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
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isError={isShowError('email')}
                    onBlur={formik.handleBlur}
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.FieldWrapper}
            >
                <div className={styles.label}>
                    {t('Имя пользователя')} <br/>
                    {isShowError('username') &&
                        <div className={styles.error}>{t(formik.errors.username)}</div>
                    }
                </div>

                <div className={styles.InputWrapper}>
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
                        isError={isShowError('username')}
                        autoComplete={'off'}
                        onBlur={formik.handleBlur}
                        type="text"
                    />

                    <ul className={
                        classNames(
                            styles.validationList,
                            [Boolean(formik.errors.username) && styles.errorValidationList]
                        )
                    }>
                        <li className={usernameLengthValid ? styles.valid : ''}>
                            <CheckIcon />
                            {t('От 3 до 15 символов')}
                        </li>
                        <li className={usernameCharsValid ? styles.valid : ''}>
                            <CheckIcon />
                            {t('Используются только латинские буквы, цифры и специальные символы ( - _ )')}
                        </li>
                        <li className={usernameStartsWithLetter ? styles.valid : ''}>
                            <CheckIcon />
                            {t('Начинается с буквы')}
                        </li>
                    </ul>
                </div>
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

                <div className={styles.InputWrapper}>
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
                        isError={isShowError('password')}
                        onBlur={formik.handleBlur}
                    />

                    <ul className={
                        classNames(
                            styles.validationList,
                            [Boolean(formik.errors.password) && styles.errorValidationList]
                        )
                    }>
                        <li className={passwordLengthValid ? styles.valid : ''}>
                            <CheckIcon />
                            {t('От 6 до 15 символов')}
                        </li>
                        <li className={passwordCharsValid ? styles.valid : ''}>
                            <CheckIcon />
                            {t('Используются только латинские буквы, цифры и специальные символы (!@#$%^&*)')}
                        </li>
                    </ul>
                </div>
            </FormControl>

            <FormControl
                fullWidth
                className={styles.FieldWrapper}
            >
                <div className={styles.label}>
                    {t('Подтверждение пароля')}<br/>
                    {isShowError('confirmPassword') &&
                        <div className={styles.error}>{t(formik.errors.confirmPassword)}</div>
                    }
                </div>
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
                    isError={isShowError('confirmPassword')}
                    onBlur={formik.handleBlur}
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
