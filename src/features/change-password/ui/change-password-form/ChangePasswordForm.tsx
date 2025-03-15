import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './ChangePasswordForm.module.scss';
import { useTranslation } from 'react-i18next';
import { CustomInput, icons, SvgIcon } from '@/shared/ui';
import { memo, useCallback, useState } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { newPassword } from '@/features/change-password';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';

const validationSchema = yup.object({
    newPassword: yup.string()
        .required('Новый пароль обязателен')
        .matches(/^[a-zA-Z0-9!@#$%^&*]{6,15}$/, 'Не соответствует шаблону'),
    confirmPassword: yup.string()
        .required('Подтверждение пароля обязательно')
        .oneOf([yup.ref('newPassword')], 'Пароли не совпадают'),
});

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

export interface RegistrationFormProps {
    token: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = (props) => {
    const { token } = props;

    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                await dispatch(newPassword({
                    token: token, 
                    ...values 
                })).unwrap();

                navigate(RoutePath.auth);
            } catch (error) {
                setError(error);
            }
        },
    });

    const {
        lengthValid: passwordLengthValid,
        charsValid: passwordCharsValid
    } = isPasswordValid(formik.values.newPassword);

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
                    {t('Новый пароль')}<br/>
                    {isShowError('newPassword') &&
                        <div className={styles.error}>{t(formik.errors.newPassword)}</div>
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
                        id="newPassword"
                        placeholder={t('Новый пароль')}
                        fullWidth
                        name="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        type={showPassword ? 'text' : 'password'}
                        isError={isShowError('newPassword')}
                        onBlur={formik.handleBlur}
                    />

                    <ul className={
                        classNames(
                            styles.validationList,
                            [formik.errors.newPassword ? styles.errorValidationList : '']
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
                {t('Изменить')}
            </button>
        </form>
    );
};

export default RegistrationForm;
