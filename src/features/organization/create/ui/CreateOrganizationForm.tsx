import { CustomInput, icons, Loader, SvgIcon, ValidationList, ValidationListItem } from '@/shared/ui';
import styles from './CreateOrganizationForm.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { FormControl } from '@mui/material';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { createOrganization } from '@/entities/organization';
import { isOrganizationNameValid } from '@/shared/lib/utils/validation.ts';

export interface CreateOrganizationFormProps {
  className?: string;
  onCreateHandler?: () => void;
}

const validationSchema = yup.object({
  orgName: yup.string()
    .required('Название обязательно')
    .matches(/^.{6,20}$/, 'Не соответствует шаблону'),
});

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = (props) => {
  const { className, onCreateHandler } = props;
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      orgName: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);
      try {
        await dispatch(createOrganization(values)).unwrap();
        onCreateHandler?.();
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitLoading(false);
      }
    },
  });

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    formik.handleSubmit();
  }, [formik.handleSubmit]);

  const organizationNameValidation = isOrganizationNameValid(formik.values.orgName);
  
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
          Объединяйте команду, управляйте проектами и контролируйте процессы в одном месте.
        </span>
      </div>

      <form className={classNames('form', [styles.form])} onSubmit={onSubmit}>
        <FormControl
          fullWidth
          className="FieldWrapper"
        >
          <div className="label">
            {t('Название') as string}<br/>
            {isFormikErrorVisible(formik, 'orgName', { checkTouched: false }) &&
              <div className="fieldError">{t(formik.errors.orgName) as string}</div>
            }
          </div>

          <ValidationList
            items={organizationNameValidation}
            hasError={isFormikErrorVisible(formik, 'orgName')}
          >
            <CustomInput
              id="orgName"
              placeholder={t('Название')}
              fullWidth
              type="text"
              name="orgName"
              value={formik.values.orgName}
              onChange={formik.handleChange}
              isError={isFormikErrorVisible(formik, 'orgName', { checkTouched: false })}
              onBlur={formik.handleBlur}
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
            ? <Loader className="submitLoader" />
            : <>{t('Создать')}</>
          }
        </button>
      </form>
    </div>
  );
};

export default CreateOrganizationForm;
