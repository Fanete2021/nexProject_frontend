import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useTranslation } from 'react-i18next';
import { CustomInput, icons, CircleLoader, SvgIcon, ValidationList } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { ApiError } from '@/shared/types/apiError.ts';
import { newPassword } from '../../model/service/newPassword.ts';
import { isPasswordValid } from '@/features/account/auth';

const validationSchema = yup.object({
  newPassword: yup.string()
    .required('Новый пароль обязателен')
    .matches(/^[a-zA-Z0-9!@#$%^&*-]{6,15}$/, 'Не соответствует шаблону'),
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
  const [formError, setFormError] = useState<ApiError>(null);
  const navigate = useNavigate();
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);
      try {
        await dispatch(newPassword({
          token: token, 
          ...values 
        })).unwrap();

        navigate(RoutePath.auth);
      } catch (error) {
        setFormError(error);
      } finally {
        setIsSubmitLoading(false);
      }
    },
  });

  const passwordValidation = isPasswordValid(formik.values.newPassword);

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
      {formError &&
        <div className="formError">{t(formError.errDetails) as string}</div>
      }

      <FormControl
        fullWidth
        className="FieldWrapper"
      >
        <div className="label">
          {t('Новый пароль') as string}<br/>
          {isFormikErrorVisible(formik,'newPassword') &&
            <div className="fieldError">{t(formik.errors.newPassword) as string}</div>
          }
        </div>

        <ValidationList
          items={passwordValidation}
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
          {t('Подтверждение пароля') as string}<br/>
          {isFormikErrorVisible(formik, 'confirmPassword') &&
            <div className="fieldError">{t(formik.errors.confirmPassword) as string}</div>
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
          ? <CircleLoader className="submitLoader" />
          : <>{t('Изменить')}</>
        }
      </button>
    </form>
  );
};

export default RegistrationForm;
