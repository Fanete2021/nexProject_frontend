import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useTranslation } from 'react-i18next';
import { registration } from '@/features/registration/ui/model/service/registration.ts';
import { CustomInput, icons, Loader, SvgIcon, ValidationList, ValidationListItem } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { isPasswordValid, isUsernameValid } from '@/shared/lib/utils/validation.ts';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { fetchUserData } from '@/entities/user';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { useNavigate } from 'react-router-dom';
import { getMessageFromApiError } from '@/shared/lib/utils/getMessageFromApiError.ts';

const validationSchema = yup.object({
  email: yup.string().email('Почта невалидна').required('Почта обязательна'),
  username: yup.string()
    .required('Имя пользователя обязательно')
    .matches(/^[a-zA-Z][a-zA-Z0-9-_]{2,14}$/,'Не соответствует шаблону'),
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
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');

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
      setIsSubmitLoading(true);
      try {
        await dispatch(registration(values)).unwrap();
        await dispatch(fetchUserData());

        navigate(RoutePath.emailConfirm);
      } catch (error) {
        setEmailError(getMessageFromApiError(error, 'email'));
        setUsernameError(getMessageFromApiError(error, 'username'));
      } finally {
        setIsSubmitLoading(false);
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
          {t('Почта')}<br/>
          {(isFormikErrorVisible(formik, 'email') || emailError) &&
                        <div className="fieldError">{t(formik.errors.email || emailError)}</div>
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
          onChange={handleChangeEmail}
          isError={isFormikErrorVisible(formik, 'email') || Boolean(emailError)}
          onBlur={formik.handleBlur}
        />
      </FormControl>

      <FormControl
        fullWidth
        className="FieldWrapper"
      >
        <div className="label">
          {t('Имя пользователя')} <br/>
          {(isFormikErrorVisible(formik, 'username') || usernameError) &&
                        <div className="fieldError">{t(formik.errors.username || usernameError)}</div>
          }
        </div>

        <ValidationList
          items={usernameValidationListItems}
          hasError={isFormikErrorVisible(formik, 'username')}
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
            id="username"
            placeholder={t('Имя пользователя')}
            fullWidth
            name="username"
            value={formik.values.username}
            onChange={handleChangeUsername}
            isError={isFormikErrorVisible(formik, 'username') || Boolean(usernameError)}
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
                        <div className="fieldError">{t(formik.errors.password)}</div>
          }
        </div>

        <ValidationList
          items={passwordValidationListItems}
          hasError={isFormikErrorVisible(formik, 'password')}
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
                        <div className="fieldError">{t(formik.errors.confirmPassword)}</div>
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
        disabled={isSubmitLoading}
      >
        {isSubmitLoading
          ? <Loader className="submitLoader" />
          : <>{t('Создать')}</>
        }
      </button>
    </form>
  );
};

export default RegistrationForm;
