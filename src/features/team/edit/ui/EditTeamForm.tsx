import { editTeam, isTeamDescriptionValid, isTeamNameValid, isTeamTagValid, TeamInfo } from '@/entities/team';
import {
  CircleLoader,
  CustomInput,
  CustomTextarea,
  icons, ListInput, Scrollbar,
  SvgIcon,
  ValidationList,
  ValidationListDirections
} from '@/shared/ui';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './EditTeamForm.module.scss';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { FormControl } from '@mui/material';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { ApiError } from '@/shared/types/apiError.ts';
import { useTranslation } from 'react-i18next';

export interface EditTeamFormProps {
  team: TeamInfo;
  onEditHandler: (newTeam: TeamInfo) => void;
  validationListDirection?: ValidationListDirections;
  className?: string;
}

const enum FORM_FIELDS {
  NEW_TEAM_NAME = 'newTeamName',
  NEW_TEAM_DESCRIPTION = 'newTeamDescription',
  NEW_TEAM_TAGS = 'newTeamTags',
}

const validationSchema = yup.object({
  [FORM_FIELDS.NEW_TEAM_NAME]: yup.string()
    .required('Название обязательно')
    .matches(/^.{6,20}$/, 'Не соответствует шаблону'),
  [FORM_FIELDS.NEW_TEAM_DESCRIPTION]: yup.string()
    .matches(/^.{0,255}$/, 'Не соответствует шаблону'),
});

const EditTeamForm: React.FC<EditTeamFormProps> = (props) => {
  const { team, onEditHandler, validationListDirection, className } = props;

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const formik = useFormik({
    initialValues: {
      [FORM_FIELDS.NEW_TEAM_NAME]: '',
      [FORM_FIELDS.NEW_TEAM_DESCRIPTION]: '',
      [FORM_FIELDS.NEW_TEAM_TAGS]: []
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitLoading(true);
      try {
        console.log(values[FORM_FIELDS.NEW_TEAM_TAGS])

        const response = await dispatch(editTeam({
          teamId: team.teamId,
          newTeamName: values[FORM_FIELDS.NEW_TEAM_NAME],
          newTeamDescription: values[FORM_FIELDS.NEW_TEAM_DESCRIPTION],
          newTeamTags: values[FORM_FIELDS.NEW_TEAM_TAGS].map(tag => ({ tagName: tag, tagColor: '' }) ),
        })).unwrap();

        formik.resetForm();
        onEditHandler?.(response);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setIsSubmitLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      [FORM_FIELDS.NEW_TEAM_DESCRIPTION]: team.teamDescription || '',
      [FORM_FIELDS.NEW_TEAM_NAME]: team.teamName,
      [FORM_FIELDS.NEW_TEAM_TAGS]: team.teamTags.map(tag => tag.tagName)
    });
  }, [team]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    formik.handleSubmit();
  }, [formik]);

  const changeTags = useCallback((tags: string[]) => {
    formik.setValues({
      ...formik.values,
      [FORM_FIELDS.NEW_TEAM_TAGS]: tags
    });
  }, [formik]);

  const teamNameValid = isTeamNameValid(formik.values[FORM_FIELDS.NEW_TEAM_NAME]);
  const teamDescriptionValid = isTeamDescriptionValid(formik.values[FORM_FIELDS.NEW_TEAM_DESCRIPTION]);

  return (
    <div className={classNames(styles.EditTeamForm, [className])}>
      <SvgIcon
        iconName={icons.TEAM}
        className={styles.iconTeam}
        applyHover={false}
        important
      />

      <div className={styles.header}>
        <span className={styles.title}>Редактирование команды<br/> {team.teamName}</span>
      </div>

      <form className={classNames('form', [styles.form])} onSubmit={onSubmit}>
        {error &&
          <div className="formError">{error.errDetails}</div>
        }

        <div className={styles.scrollbarContainer}>
          <Scrollbar autoHeight autoHeightMin={0} autoHeightMax="100%">
            <FormControl
              fullWidth
              className="FieldWrapper"
            >
              <div className="label">
                {t('Название') as string}<br/>
                {isFormikErrorVisible(formik, 'teamName', { checkTouched: false }) &&
                  <div className="fieldError">{t(formik.errors[FORM_FIELDS.NEW_TEAM_NAME]) as string}</div>
                }
              </div>

              <ValidationList
                items={teamNameValid}
                hasError={isFormikErrorVisible(formik, FORM_FIELDS.NEW_TEAM_NAME)}
                direction={validationListDirection}
              >
                <CustomInput
                  id={FORM_FIELDS.NEW_TEAM_NAME}
                  placeholder={t('Название')}
                  fullWidth
                  type="text"
                  name={FORM_FIELDS.NEW_TEAM_NAME}
                  value={formik.values[FORM_FIELDS.NEW_TEAM_NAME]}
                  onChange={formik.handleChange}
                  isError={isFormikErrorVisible(formik, FORM_FIELDS.NEW_TEAM_NAME, { checkTouched: false })}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                />
              </ValidationList>
            </FormControl>

            <FormControl
              fullWidth
              className="FieldWrapper"
            >
              <div className="label">
                {t('Описание') as string}<br/>
                {isFormikErrorVisible(formik, FORM_FIELDS.NEW_TEAM_DESCRIPTION, { checkTouched: false }) &&
                  <div className="fieldError">{t(formik.errors[FORM_FIELDS.NEW_TEAM_DESCRIPTION]) as string}</div>
                }
              </div>

              <ValidationList
                items={teamDescriptionValid}
                hasError={isFormikErrorVisible(formik, FORM_FIELDS.NEW_TEAM_DESCRIPTION)}
                direction={validationListDirection}
              >
                <CustomTextarea
                  id={FORM_FIELDS.NEW_TEAM_DESCRIPTION}
                  placeholder={t('Описание')}
                  name={FORM_FIELDS.NEW_TEAM_DESCRIPTION}
                  value={formik.values[FORM_FIELDS.NEW_TEAM_DESCRIPTION]}
                  onChange={formik.handleChange}
                  isError={isFormikErrorVisible(formik, FORM_FIELDS.NEW_TEAM_DESCRIPTION, { checkTouched: false })}
                  onBlur={formik.handleBlur}
                  classes={{
                    wrapper: styles.textareaWrapper
                  }}
                />
              </ValidationList>
            </FormControl>

            <FormControl
              fullWidth
              className="FieldWrapper"
            >
              <div className="label">
                {t('Теги') as string} ({formik.values[FORM_FIELDS.NEW_TEAM_TAGS].length} шт.)<br/>
                {isFormikErrorVisible(formik, FORM_FIELDS.NEW_TEAM_TAGS, { checkTouched: false }) &&
                  <div className="fieldError">{t(formik.errors[FORM_FIELDS.NEW_TEAM_TAGS]) as string}</div>
                }
              </div>

              <ListInput
                inputProps={{
                  id: FORM_FIELDS.NEW_TEAM_TAGS,
                  placeholder: t('Тег') as string,
                  fullWidth: true,
                  type: 'text',
                  name: FORM_FIELDS.NEW_TEAM_TAGS,
                  onBlur: formik.handleBlur,
                  autoComplete: 'off'
                }}
                items={formik.values[FORM_FIELDS.NEW_TEAM_TAGS]}
                maxItems={5}
                onChange={changeTags}
                isValueValid={isTeamTagValid}
              />
            </FormControl>
          </Scrollbar>
        </div>

        <button
          className="submit"
          type={'submit'}
          onClick={onSubmit}
          disabled={isSubmitLoading}
        >
          {isSubmitLoading
            ? <CircleLoader className="submitLoader" />
            : <>{t('Сохранить')}</>
          }
        </button>
      </form>
    </div>
  );
};

export default EditTeamForm;
