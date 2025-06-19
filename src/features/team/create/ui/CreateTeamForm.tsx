import { CustomInput, icons, CircleLoader, SvgIcon, ValidationList, ValidationListDirections } from '@/shared/ui';
import styles from './CreateTeamForm.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { FormControl } from '@mui/material';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { createTeam, isTeamNameValid } from '@/entities/team';
import { ApiError } from '@/shared/types/apiError.ts';

export interface CreateTeamFormProps {
  className?: string;
  organizationId: string;
  onCreateHandler?: () => void;
  validationListDirection?: ValidationListDirections;
}

const enum FORM_FIELDS {
  TEAM_NAME = 'teamName',
}

const validationSchema = yup.object({
  [FORM_FIELDS.TEAM_NAME]: yup.string()
    .required('Название обязательно')
    .matches(/^.{6,20}$/, 'Не соответствует шаблону'),
});

const CreateTeamForm: React.FC<CreateTeamFormProps> = (props) => {
  const { className, organizationId, onCreateHandler, validationListDirection = ValidationListDirections.ALL } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const formik = useFormik({
    initialValues: {
      [FORM_FIELDS.TEAM_NAME]: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);
      try {
        await dispatch(createTeam({
          ...values,
          organizationId
        })).unwrap();

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

  const teamNameValid = isTeamNameValid(formik.values[FORM_FIELDS.TEAM_NAME]);

  return (
    <div className={classNames(styles.CreateTeamForm, [className])}>
      <SvgIcon
        iconName={icons.TEAM}
        className={styles.iconTeam}
        applyHover={false}
        important
      />

      <div className={styles.header}>
        <span className={styles.title}>Создайте команду!</span>
        <span className={styles.subtitle}>
          Создавайте доски задач, отслеживайте выполнение задач и оценивайте эффективность участников
        </span>
      </div>

      <form className={classNames('form', [styles.form])} onSubmit={onSubmit}>
        {error &&
          <div className="formError">{error.errDetails}</div>
        }

        <FormControl
          fullWidth
          className="FieldWrapper"
        >
          <div className="label">
            {t('Название') as string}<br/>
            {isFormikErrorVisible(formik, FORM_FIELDS.TEAM_NAME, { checkTouched: false }) &&
              <div className="fieldError">{t(formik.errors[FORM_FIELDS.TEAM_NAME]) as string}</div>
            }
          </div>

          <ValidationList
            items={teamNameValid}
            hasError={isFormikErrorVisible(formik, FORM_FIELDS.TEAM_NAME)}
            direction={validationListDirection}
          >
            <CustomInput
              id={FORM_FIELDS.TEAM_NAME}
              placeholder={t('Название')}
              fullWidth
              type="text"
              name={FORM_FIELDS.TEAM_NAME}
              value={formik.values[FORM_FIELDS.TEAM_NAME]}
              onChange={formik.handleChange}
              isError={isFormikErrorVisible(formik, FORM_FIELDS.TEAM_NAME, { checkTouched: false })}
              onBlur={formik.handleBlur}
              autoComplete="off"
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

export default CreateTeamForm;
