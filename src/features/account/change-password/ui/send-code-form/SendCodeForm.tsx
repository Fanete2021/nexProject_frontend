import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useTranslation } from 'react-i18next';
import { CustomInput, icons, CircleLoader, SvgIcon } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { changePassword } from '../../model/service/changePassword.ts';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';

const validationSchema = yup.object({
  email: yup.string().email('Почта невалидна').required('Почта обязательна'),
});

function extractMinutes(errorDetails) {
  const match = errorDetails.match(/Try again after (\d+) minutes?/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

function extractEmail(errorDetails) {
  const match = errorDetails.match(/User with email '([^']+)' does not exist/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

const SendCodeForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [formError, setFormError] = useState<string>('');
  const [formSuccessText, setFormSuccessText] = useState<string>('');
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);
      try {
        await dispatch(changePassword(values)).unwrap();

        setFormSuccessText('Код отправлен');
        setFormError('');
      } catch (error) {
        setFormSuccessText('');
        const { errDetails } = error;
        const minutes = extractMinutes(errDetails);
        const email = extractEmail(errDetails);

        if (minutes) {
          setFormError(t('too_many_requests', { minutes }));
        } else if (email) {
          setFormError(t('user_not_found', { email }));
        } else {
          setFormError(errDetails);
        }
      } finally {
        setIsSubmitLoading(false);
      }
    },
  });

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    formik.handleSubmit();
  }, [formik.handleSubmit]);

  return (
    <form className="form" onSubmit={onSubmit}>
      {formSuccessText &&
        <div className="formSuccess">{t(formSuccessText)}</div>
      }
      {formError &&
        <div className="formError">{formError}</div>
      }

      <FormControl
        fullWidth
        className="FieldWrapper"
      >
        <div className="label">
          {t('Почта')}<br/>
          {isFormikErrorVisible(formik, 'email') &&
            <div className="fieldError">{t(formik.errors.email)}</div>
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

      <button
        className="submit"
        type={'submit'}
        onClick={onSubmit}
        disabled={isSubmitLoading}
      >
        {isSubmitLoading
          ? <CircleLoader className="submitLoader" />
          : <>{t('Сменить пароль')}</>
        }
      </button>
    </form>
  );
};

export default SendCodeForm;
