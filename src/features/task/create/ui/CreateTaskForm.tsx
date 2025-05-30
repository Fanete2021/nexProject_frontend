import React, { useCallback, useState } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useFormik } from 'formik';
import { isTaskNameValid } from '@/shared/lib/utils/validation.ts';
import { createTask, TaskInfo, TaskPriorities } from '@/entities/task';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { CustomInput, icons, Loader, SvgIcon, ValidationList, ValidationListDirections } from '@/shared/ui';
import { FormControl } from '@mui/material';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import styles from './CreateTaskForm.module.scss';
import { TaskBoardInfo } from '@/entities/task-board';

export interface CreateTaskFormProps {
  teamId: string;
  board: TaskBoardInfo;
  className?: string;
  onCreateHandler?: (newTask: TaskInfo) => void;
  validationListDirection?: ValidationListDirections;
}

const validationSchema = yup.object({
  taskName: yup.string()
    .required('Название обязательно')
    .matches(/^.{6,20}$/, 'Не соответствует шаблону'),
});

const CreateTaskForm: React.FC<CreateTaskFormProps> = (props) => {
  const { className, onCreateHandler, teamId, board, validationListDirection = ValidationListDirections.ALL } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      taskName: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);

      try {
        const response = await dispatch(createTask({
          teamId,
          newTask: {
            boardId: board.boardId,
            statusId: board.boardStatuses[0].statusId,
            priority: TaskPriorities.LOW,
            ...values
          }
        })).unwrap();

        formik.resetForm();
        onCreateHandler?.(response);
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

  const taskNameValidation = isTaskNameValid(formik.values.taskName);

  return (
    <div className={classNames(styles.CreateTaskForm, [className])}>
      <SvgIcon
        iconName={icons.TASK}
        className={styles.iconTask}
        applyHover={false}
        important
      />

      <div className={styles.header}>
        <span className={styles.title}>Создайте задачу!</span>
      </div>

      <form className={classNames('form', [styles.form])} onSubmit={onSubmit}>
        <FormControl
          fullWidth
          className="FieldWrapper"
        >
          <div className="label">
            {t('Название') as string}<br/>
            {isFormikErrorVisible(formik, 'taskName', { checkTouched: false }) &&
              <div className="fieldError">{t(formik.errors.taskName) as string}</div>
            }
          </div>

          <ValidationList
            items={taskNameValidation}
            hasError={isFormikErrorVisible(formik, 'taskName')}
            direction={validationListDirection}
          >
            <CustomInput
              id="taskName"
              placeholder={t('Название')}
              fullWidth
              type="text"
              name="taskName"
              value={formik.values.taskName}
              onChange={formik.handleChange}
              isError={isFormikErrorVisible(formik, 'taskName', { checkTouched: false })}
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

export default CreateTaskForm;
