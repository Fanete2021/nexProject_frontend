import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useTranslation } from 'react-i18next';
import { CustomInput, icons, CircleLoader, SvgIcon, ValidationList } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { fetchUserData } from '@/entities/user';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { useNavigate } from 'react-router-dom';
import { getMessageFromApiError } from '@/shared/lib/utils/getMessageFromApiError.ts';
import { ApiError } from '@/shared/types/apiError.ts';
import { registration } from '../../model/service/registration.ts';
import { isPasswordValid, isUsernameValid } from '@/features/account/auth';

const enum FORM_FIELDS {
  EMAIL = 'email',
  USERNAME = 'username',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword',
}

const validationSchema = yup.object({
  [FORM_FIELDS.EMAIL]: yup.string().email('Почта невалидна').required('Почта обязательна'),
  [FORM_FIELDS.USERNAME]: yup.string()
    .required('Имя пользователя обязательно')
    .matches(/^[a-zA-Z][a-zA-Z0-9-_]{2,14}$/,'Не соответствует шаблону'),
  [FORM_FIELDS.PASSWORD]: yup.string()
    .required('Пароль обязателен')
    .matches(/^[a-zA-Z0-9!@#$%^&*-]{6,15}$/, 'Не соответствует шаблону'),
  [FORM_FIELDS.CONFIRM_PASSWORD]: yup.string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password')], 'Пароли не совпадают'),
});

const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      [FORM_FIELDS.EMAIL]: '',
      [FORM_FIELDS.USERNAME]: '',
      [FORM_FIELDS.PASSWORD]: '',
      [FORM_FIELDS.CONFIRM_PASSWORD]: ''
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);
      try {
        await dispatch(registration(values)).unwrap();
        await dispatch(fetchUserData());

        navigate(RoutePath.emailConfirm);
      } catch (error: ApiError) {
        setEmailError(getMessageFromApiError(error, FORM_FIELDS.EMAIL) || '');
        setUsernameError(getMessageFromApiError(error, FORM_FIELDS.USERNAME) || '');
      } finally {
        setIsSubmitLoading(false);
      }
    },
  });

  const usernameValidation = isUsernameValid(formik.values[FORM_FIELDS.USERNAME]);
  const passwordValidation = isPasswordValid(formik.values[FORM_FIELDS.PASSWORD]);

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

  const handleChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailError('');
    formik.handleChange(e);
  }, []);

  const handleChangeUsername = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameError('');
    formik.handleChange(e);
  }, []);

  return (
    <form className="form" onSubmit={onSubmit}>
      <FormControl
        fullWidth
        className="FieldWrapper"
      >
        <div className="label">
          {t('Почта') as string}<br/>
          {(isFormikErrorVisible(formik, FORM_FIELDS.EMAIL) || emailError) &&
            <div className="fieldError">{t(formik.errors[FORM_FIELDS.EMAIL] || emailError) as string}</div>
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
          id={FORM_FIELDS.EMAIL}
          placeholder={t('Почта')}
          fullWidth
          type="email"
          name={FORM_FIELDS.EMAIL}
          value={formik.values[FORM_FIELDS.EMAIL]}
          onChange={handleChangeEmail}
          isError={isFormikErrorVisible(formik, FORM_FIELDS.EMAIL) || Boolean(emailError)}
          onBlur={formik.handleBlur}
        />
      </FormControl>

      <FormControl
        fullWidth
        className="FieldWrapper"
      >
        <div className="label">
          {t('Имя пользователя') as string} <br/>
          {(isFormikErrorVisible(formik, FORM_FIELDS.USERNAME) || usernameError) &&
            <div className="fieldError">{t(formik.errors[FORM_FIELDS.USERNAME] || usernameError) as string}</div>
          }
        </div>

        <ValidationList
          items={usernameValidation}
          hasError={isFormikErrorVisible(formik, FORM_FIELDS.USERNAME)}
        >
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
            id={FORM_FIELDS.USERNAME}
            placeholder={t('Имя пользователя')}
            fullWidth
            name={FORM_FIELDS.USERNAME}
            value={formik.values.username}
            onChange={handleChangeUsername}
            isError={isFormikErrorVisible(formik, FORM_FIELDS.USERNAME) || Boolean(usernameError)}
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
          {t('Пароль') as string}<br/>
          {isFormikErrorVisible(formik, FORM_FIELDS.PASSWORD) &&
            <div className="fieldError">{t(formik.errors[FORM_FIELDS.PASSWORD]) as string}</div>
          }
        </div>

        <ValidationList
          items={passwordValidation}
          hasError={isFormikErrorVisible(formik, FORM_FIELDS.PASSWORD)}
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
            id={FORM_FIELDS.PASSWORD}
            placeholder={t('Пароль')}
            fullWidth
            name={FORM_FIELDS.PASSWORD}
            value={formik.values[FORM_FIELDS.PASSWORD]}
            onChange={formik.handleChange}
            type={showPassword ? 'text' : 'password'}
            isError={isFormikErrorVisible(formik, FORM_FIELDS.PASSWORD)}
            onBlur={formik.handleBlur}
          />
        </ValidationList>
      </FormControl>

      <FormControl
        fullWidth
        className="FieldWrapper"
      >
        <div className="label">
          {t('Подтверждение пароля') as string}<br/>
          {isFormikErrorVisible(formik, FORM_FIELDS.CONFIRM_PASSWORD) &&
            <div className="fieldError">{t(formik.errors[FORM_FIELDS.CONFIRM_PASSWORD]) as string}</div>
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
          id={FORM_FIELDS.CONFIRM_PASSWORD}
          placeholder={t('Повторите пароль')}
          fullWidth
          name={FORM_FIELDS.CONFIRM_PASSWORD}
          value={formik.values[FORM_FIELDS.CONFIRM_PASSWORD]}
          onChange={formik.handleChange}
          type={showConfirmPassword ? 'text' : 'password'}
          isError={isFormikErrorVisible(formik, FORM_FIELDS.CONFIRM_PASSWORD)}
          onBlur={formik.handleBlur}
        />
      </FormControl>

      <button
        className="submit"
        type={'submit'}
        onClick={onSubmit}
        disabled={isSubmitLoading}
      >
        {isSubmitLoading
          ? <CircleLoader className="submitLoader" />
          : <>{t('Создать')}</>
        }
      </button>
    </form>
  );
};

export default RegistrationForm;
