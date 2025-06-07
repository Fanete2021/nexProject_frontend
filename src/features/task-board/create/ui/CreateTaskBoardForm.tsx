import {CustomInput, icons, CircleLoader, SvgIcon, ValidationList, ValidationListDirections} from '@/shared/ui';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { FormControl } from '@mui/material';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { isTaskBoardNameValid } from '@/shared/lib/utils/validation.ts';
import { createTaskBoard } from '@/entities/task-board';
import styles from './CreateTaskBoardForm.module.scss';

export interface CreateTaskBoardFormProps {
  teamId: string;
  className?: string;
  onCreateHandler?: () => void;
  validationListDirection?: ValidationListDirections;
}

const validationSchema = yup.object({
  boardName: yup.string()
    .required('Название обязательно')
    .matches(/^.{6,20}$/, 'Не соответствует шаблону'),
});

const CreateTaskBoardForm: React.FC<CreateTaskBoardFormProps> = (props) => {
  const { className, onCreateHandler, teamId, validationListDirection = ValidationListDirections.ALL } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      boardName: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);
      try {
        await dispatch(createTaskBoard({
          ...values,
          teamId: teamId
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

  const boardNameValidation = isTaskBoardNameValid(formik.values.boardName);

  return (
    <div className={classNames(styles.CreateBoardForm, [className])}>
      <SvgIcon
        iconName={icons.TASK_BOARD}
        className={styles.iconBoard}
        applyHover={false}
        important
      />

      <div className={styles.header}>
        <span className={styles.title}>Создайте доску!</span>
        <span className={styles.subtitle}>
          Организуйте задачи, отслеживайте прогресс и оптимизируйте рабочие процессы с помощью Kanban-доски. Создавайте, назначайте и перемещайте задачи между этапами выполнения.
        </span>
      </div>

      <form className={classNames('form', [styles.form])} onSubmit={onSubmit}>
        <FormControl
          fullWidth
          className="FieldWrapper"
        >
          <div className="label">
            {t('Название') as string}<br/>
            {isFormikErrorVisible(formik, 'boardName', { checkTouched: false }) &&
              <div className="fieldError">{t(formik.errors.boardName) as string}</div>
            }
          </div>

          <ValidationList
            items={boardNameValidation}
            hasError={isFormikErrorVisible(formik, 'boardName')}
            direction={validationListDirection}
          >
            <CustomInput
              id="boardName"
              placeholder={t('Название')}
              fullWidth
              type="text"
              name="boardName"
              value={formik.values.boardName}
              onChange={formik.handleChange}
              isError={isFormikErrorVisible(formik, 'boardName', { checkTouched: false })}
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

export default CreateTaskBoardForm;
