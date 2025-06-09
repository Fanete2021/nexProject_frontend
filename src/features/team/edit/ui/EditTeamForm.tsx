import {
  deleteTeam,
  editTeam,
  getMyRoleInTeam, isOwnerInTeam,
  isTeamDescriptionValid,
  isTeamNameValid,
  isTeamTagValid,
  TeamInfo
} from '@/entities/team';
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
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user';

export interface EditTeamFormProps {
  team: TeamInfo;
  onEditHandler: (newTeam: TeamInfo) => void;
  validationListDirection?: ValidationListDirections;
  className?: string;
  onDeleteHandler: (teamId: string) => void;
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
  const { team, onEditHandler, validationListDirection, className, onDeleteHandler } = props;

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const user = useSelector(getUserData)!;

  const myRole = getMyRoleInTeam(team, user);

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
      setIsActionLoading(true);
      try {
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
        setIsActionLoading(false);
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

  const deleteTeamHandler = useCallback(async () => {
    try {
      setIsActionLoading(true);
      await dispatch(deleteTeam({ teamId: team.teamId })).unwrap();
      onDeleteHandler(team.teamId);
    } catch (error) {
      setError(error);
    } finally {
      setIsActionLoading(false);
    }
  }, [dispatch]);

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

        <div className={styles.actions}>
          <button
            className={classNames('submit', [], {
              [styles.submit]: isOwnerInTeam(myRole)
            })}
            type={'submit'}
            onClick={onSubmit}
            disabled={isActionLoading}
          >
            {isActionLoading
              ? <CircleLoader className="submitLoader" />
              : <>{t('Сохранить')}</>
            }
          </button>

          {isOwnerInTeam(myRole) &&
            <button
              className={classNames('delete', [styles.delete])}
              onClick={deleteTeamHandler}
              type={'button'}
              disabled={isActionLoading}
            >
              {isActionLoading
                ? <CircleLoader className="deleteLoader" />
                :
                <>
                  {t('Удалить') as string}

                  <SvgIcon
                    iconName={icons.DELETE}
                    applyStroke
                    applyFill={false}
                    important
                    applyHover={false}
                  />
                </>
              }
            </button>
          }
        </div>
      </form>
    </div>
  );
};

export default EditTeamForm;
