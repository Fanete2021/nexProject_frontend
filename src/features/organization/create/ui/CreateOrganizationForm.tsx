import {
  CustomInput,
  CustomTextarea,
  icons,
  CircleLoader,
  SvgIcon,
  ValidationList,
  ValidationListDirections
} from '@/shared/ui';
import styles from './CreateOrganizationForm.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { FormControl } from '@mui/material';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { createOrganization, isOrganizationDescriptionValid, isOrganizationNameValid } from '@/entities/organization';
import { ApiError } from '@/shared/types/apiError.ts';

export interface CreateOrganizationFormProps {
  className?: string;
  onCreateHandler?: () => void;
  validationListDirection?: ValidationListDirections;
}

const enum FORM_FIELDS {
  ORG_NAME = 'orgName',
  ORG_DESCRIPTION = 'orgDescription'
}

const validationSchema = yup.object({
  [FORM_FIELDS.ORG_NAME]: yup.string()
    .required('Название обязательно')
    .matches(/^[\p{L}0-9&_ -]{3,48}$/u, 'Не соответствует шаблону'),
  [FORM_FIELDS.ORG_DESCRIPTION]: yup.string()
    .matches(/^.{0,255}$/, 'Не соответствует шаблону'),
});

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = (props) => {
  const { className, onCreateHandler, validationListDirection = ValidationListDirections.ALL } = props;
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const formik = useFormik({
    initialValues: {
      [FORM_FIELDS.ORG_NAME]: '',
      [FORM_FIELDS.ORG_DESCRIPTION]: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);
      try {
        await dispatch(createOrganization(values)).unwrap();
        formik.resetForm();
        onCreateHandler?.();
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setIsSubmitLoading(false);
      }
    },
  });

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    formik.handleSubmit();
  }, [formik.handleSubmit]);

  const organizationNameValidation = isOrganizationNameValid(formik.values[FORM_FIELDS.ORG_NAME]);
  const organizationDescriptionValidation = isOrganizationDescriptionValid(formik.values[FORM_FIELDS.ORG_DESCRIPTION]);

  return (
    <div className={classNames(styles.CreateOrganizationForm, [className])}>
      <SvgIcon
        iconName={icons.ORGANIZATION}
        className={styles.iconOrganization}
        applyHover={false}
        important
      />

      <div className={styles.header}>
        <span className={styles.title}>Создайте свою организацию!</span>
        <span className={styles.subtitle}>
          Объединяйте людей, управляйте проектами и контролируйте процессы в одном месте.
        </span>
      </div>

      <form className={classNames('form', [styles.form])} onSubmit={onSubmit}>
        {error &&
          <div className="formError">{error.errDetails}</div>
        }

        <FormControl fullWidth className="FieldWrapper">
          <div className="label">
            {t('Название') as string}<br/>
            {isFormikErrorVisible(formik, FORM_FIELDS.ORG_NAME, { checkTouched: false }) &&
              <div className="fieldError">{t(formik.errors[FORM_FIELDS.ORG_NAME]) as string}</div>
            }
          </div>

          <ValidationList
            items={organizationNameValidation}
            hasError={isFormikErrorVisible(formik, FORM_FIELDS.ORG_NAME)}
            direction={validationListDirection}
          >
            <CustomInput
              id={FORM_FIELDS.ORG_NAME}
              placeholder={t('Название')}
              fullWidth
              type="text"
              name={FORM_FIELDS.ORG_NAME}
              value={formik.values[FORM_FIELDS.ORG_NAME]}
              onChange={formik.handleChange}
              isError={isFormikErrorVisible(formik, FORM_FIELDS.ORG_NAME, { checkTouched: false })}
              onBlur={formik.handleBlur}
              autoComplete="off"
            />
          </ValidationList>
        </FormControl>

        <FormControl fullWidth className="FieldWrapper">
          <div className="label">
            {t('Описание') as string}<br/>
            {isFormikErrorVisible(formik, FORM_FIELDS.ORG_DESCRIPTION, { checkTouched: false }) &&
              <div className="fieldError">{t(formik.errors[FORM_FIELDS.ORG_DESCRIPTION]) as string}</div>
            }
          </div>

          <ValidationList
            items={organizationDescriptionValidation}
            hasError={isFormikErrorVisible(formik, FORM_FIELDS.ORG_DESCRIPTION)}
            direction={validationListDirection}
          >
            <CustomTextarea
              id={FORM_FIELDS.ORG_DESCRIPTION}
              placeholder={t('Описание')}
              name={FORM_FIELDS.ORG_DESCRIPTION}
              value={formik.values[FORM_FIELDS.ORG_DESCRIPTION]}
              onChange={formik.handleChange}
              isError={isFormikErrorVisible(formik, FORM_FIELDS.ORG_DESCRIPTION, { checkTouched: false })}
              onBlur={formik.handleBlur}
              classes={{
                wrapper: styles.textareaWrapper
              }}
            />
          </ValidationList>
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
    </div>
  );
};

export default CreateOrganizationForm;
