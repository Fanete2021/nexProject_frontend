import { CustomInput, icons, Loader, SvgIcon, ValidationList, ValidationListDirections } from '@/shared/ui';
import styles from './CreateTeamForm.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { FormControl } from '@mui/material';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { isTeamNameValid } from '@/shared/lib/utils/validation.ts';
import { createTeam } from '@/entities/team';

export interface CreateTeamFormProps {
  className?: string;
  organizationId: string;
  onCreateHandler?: () => void;
  validationListDirection?: ValidationListDirections;
}

const validationSchema = yup.object({
  teamName: yup.string()
    .required('Название обязательно')
    .matches(/^.{6,20}$/, 'Не соответствует шаблону'),
});

const CreateTeamForm: React.FC<CreateTeamFormProps> = (props) => {
  const { className, organizationId, onCreateHandler, validationListDirection = ValidationListDirections.ALL } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      teamName: '',
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

  const teamNameValid = isTeamNameValid(formik.values.teamName);

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
        <FormControl
          fullWidth
          className="FieldWrapper"
        >
          <div className="label">
            {t('Название') as string}<br/>
            {isFormikErrorVisible(formik, 'teamName', { checkTouched: false }) &&
              <div className="fieldError">{t(formik.errors.teamName) as string}</div>
            }
          </div>

          <ValidationList
            items={teamNameValid}
            hasError={isFormikErrorVisible(formik, 'teamName')}
            direction={validationListDirection}
          >
            <CustomInput
              id="teamName"
              placeholder={t('Название')}
              fullWidth
              type="text"
              name="teamName"
              value={formik.values.teamName}
              onChange={formik.handleChange}
              isError={isFormikErrorVisible(formik, 'teamName', { checkTouched: false })}
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
            ? <Loader className="submitLoader" />
            : <>{t('Создать')}</>
          }
        </button>
      </form>
    </div>
  );
};

export default CreateTeamForm;
