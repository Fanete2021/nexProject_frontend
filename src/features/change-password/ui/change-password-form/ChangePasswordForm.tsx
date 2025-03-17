import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useTranslation } from 'react-i18next';
import { CustomInput, icons, SvgIcon, ValidationList, ValidationListItem } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { newPassword } from '@/features/change-password';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { isPasswordValid } from '@/shared/lib/utils/validation.ts';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';

const validationSchema = yup.object({
    newPassword: yup.string()
        .required('Новый пароль обязателен')
        .matches(/^[a-zA-Z0-9!@#$%^&*]{6,15}$/, 'Не соответствует шаблону'),
    confirmPassword: yup.string()
        .required('Подтверждение пароля обязательно')
        .oneOf([yup.ref('newPassword')], 'Пароли не совпадают'),
});

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
        passwordLengthValid,
        passwordLengthValidText,
        passwordCharsValid,
        passwordCharsValidText
    } = isPasswordValid(formik.values.newPassword);

    const newPasswordValidationListItems: ValidationListItem[] = [
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
                    {t('Новый пароль')}<br/>
                    {isFormikErrorVisible(formik,'newPassword') &&
                        <div className="error">{t(formik.errors.newPassword)}</div>
                    }
                </div>

                <ValidationList
                    items={newPasswordValidationListItems}
                    hasError={isFormikErrorVisible(formik, 'newPassword')}
                >
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
                        id="newPassword"
                        placeholder={t('Новый пароль')}
                        fullWidth
                        name="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        type={showPassword ? 'text' : 'password'}
                        isError={isFormikErrorVisible(formik, 'newPassword')}
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
                        <button type="button" onClick={handleClickShowConfirmPassword} className="showPassword">
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
                {t('Изменить')}
            </button>
        </form>
    );
};

export default RegistrationForm;
