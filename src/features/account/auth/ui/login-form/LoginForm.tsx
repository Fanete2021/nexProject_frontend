import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './LoginForm.module.scss';
import { useTranslation } from 'react-i18next';
import { CustomCheckbox, CustomInput, icons, Loader, SvgIcon } from '@/shared/ui';
import { useCallback, useEffect, useState } from 'react';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { getInputType } from '@/shared/lib/utils/getInputType.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { ApiError } from '@/shared/types/apiError.ts';
import { sendCode } from '@/features/account/confirm-email';
import { getAuthIsLoading } from '../../model/selectors/getAuthIsLoading.ts';
import { login } from '../../model/service/login.ts';

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
  const [error, setError] = useState<ApiError>(null);
  const isAuthLoading = useSelector(getAuthIsLoading);
  const navigate = useNavigate();
  const user = useSelector(getUserData);

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
      } catch (error) {
        setError(error);
      }
    },
  });

  useEffect(() => {
    if (user) {
      if (user.verify) {
        navigate(RoutePath.main);
      } else {
        try {
          dispatch(sendCode()).unwrap();
        } catch (error) {
          console.log(error);
        }
        navigate(RoutePath.emailConfirm);
      }
    }
  }, [user]);

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
    <form className="form" onSubmit={onSubmit}>
      {error &&
        <div className="formError">{t(error.errDetails)}</div>
      }

      <FormControl
        fullWidth
        className="FieldWrapper"
      >
        <div className="label">
          {t('Почта / телефон') as string}<br/>
          {isShowError('phoneNumberOrMail') &&
            <div className="fieldError">{t(formik.errors.phoneNumberOrMail)}</div>
          }
        </div>

        <CustomInput
          endAdornment={
            currentInputType && (
              <InputAdornment position="end">
                <SvgIcon
                  className={currentInputType === 'email' ? 'emailIcon' : ''}
                  iconName={
                    currentInputType === 'email'
                      ? icons.EMAIL
                      : icons.SMARTPHONE
                  }
                  applyHover={false}
                  important={false}
                />
              </InputAdornment>
            )
          }
          type='email'
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
        className="FieldWrapper"
      >
        <div className="label">
          {t('Пароль') as string}<br/>
          {isShowError('password') &&
            <div className="fieldError">{t(formik.errors.password) as string}</div>
          }
        </div>

        <CustomInput
          endAdornment={
            <InputAdornment position="end">
              <button type="button" onClick={handleClickShowPassword} className="showPassword">
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

        <Link
          to={RoutePath.newPassword}
          className={classNames(styles.forgot, ['guestLink'])}
        >
          <>{t('Забыли пароль?')}</>
        </Link>
      </div>

      <button
        className="submit"
        type={'submit'}
        onClick={onSubmit}
        disabled={isAuthLoading}
      >
        {isAuthLoading
          ? <Loader className="submitLoader" />
          : <>{t('Войти')}</>
        }
      </button>
    </form>
  );
};

export default LoginForm;
