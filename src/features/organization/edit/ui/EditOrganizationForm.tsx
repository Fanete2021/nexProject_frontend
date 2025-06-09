import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  CircleLoader,
  CustomInput,
  CustomTextarea,
  icons,
  SvgIcon,
  ValidationList,
  ValidationListDirections
} from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { ApiError } from '@/shared/types/apiError.ts';
import { useFormik } from 'formik';
import {
  deleteOrganization,
  editOrganization, getMyRoleInOrganization,
  isOrganizationDescriptionValid,
  isOrganizationNameValid, isOwnerInOrganization, OrganizationInfo
} from '@/entities/organization';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './EditOrganizationFormModal.module.scss';
import { FormControl } from '@mui/material';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user';

export interface EditOrganizationFormProps {
  className?: string;
  onEditHandler?: (newOrganization: OrganizationInfo) => void;
  onDeleteHandler?: (organizationId: string) => void;
  validationListDirection?: ValidationListDirections;
  organization: OrganizationInfo;
  hasMobileVersion: boolean;
}

const enum FORM_FIELDS {
  ORG_NAME = 'orgName',
  ORG_DESCRIPTION = 'orgDescription'
}

const validationSchema = yup.object({
  [FORM_FIELDS.ORG_NAME]: yup.string()
    .required('Название обязательно')
    .matches(/^[\p{L}0-9&_ -]{3,64}$/u, 'Не соответствует шаблону'),
  [FORM_FIELDS.ORG_DESCRIPTION]: yup.string()
    .matches(/^.{0,255}$/, 'Не соответствует шаблону'),
});

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = (props) => {
  const {
    className,
    onEditHandler,
    validationListDirection = ValidationListDirections.ALL,
    organization,
    hasMobileVersion = true,
    onDeleteHandler
  } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const user = useSelector(getUserData)!;

  const myRole = getMyRoleInOrganization(organization, user);

  const formik = useFormik({
    initialValues: {
      [FORM_FIELDS.ORG_NAME]: organization.organizationName,
      [FORM_FIELDS.ORG_DESCRIPTION]: organization.organizationDescription,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsActionLoading(true);
      try {
        const response = await dispatch(editOrganization({
          organizationId: organization.organizationId,
          organizationName: values[FORM_FIELDS.ORG_NAME],
          organizationDescription: values[FORM_FIELDS.ORG_DESCRIPTION],
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

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    formik.handleSubmit();
  }, [formik.handleSubmit]);

  useEffect(() => {
    formik.setValues({
      [FORM_FIELDS.ORG_DESCRIPTION]: organization.organizationDescription || '',
      [FORM_FIELDS.ORG_NAME]: organization.organizationName
    });
  }, [organization]);


  const deleteOrganizationHandler = useCallback(async () => {
    try {
      setIsActionLoading(true);
      await dispatch(deleteOrganization({ organizationId: organization.organizationId })).unwrap();
      onDeleteHandler?.(organization.organizationId);
    } catch (error) {
      setError(error);
    } finally {
      setIsActionLoading(false);
    }
  }, [dispatch]);

  const organizationNameValidation = isOrganizationNameValid(formik.values[FORM_FIELDS.ORG_NAME]);
  const organizationDescriptionValidation = isOrganizationDescriptionValid(formik.values[FORM_FIELDS.ORG_DESCRIPTION]);

  return (
    <div className={classNames(styles.EditOrganizationForm, [className])}>
      <SvgIcon
        iconName={icons.ORGANIZATION}
        className={styles.iconOrganization}
        applyHover={false}
        important
      />

      <div className={classNames(styles.header, [], {
        [styles.mobileHeader]: hasMobileVersion
      })}>
        <span className={styles.title}>Редактирование организации<br/> {organization.organizationName}</span>
      </div>

      <form
        className={classNames('form', [styles.form], {
          [styles.mobileForm]: hasMobileVersion,
        })}
        onSubmit={onSubmit}
      >
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

        <div className={styles.actions}>
          <button
            className={classNames('submit', [], {
              [styles.submit]: isOwnerInOrganization(myRole)
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

          {isOwnerInOrganization(myRole) &&
            <button
              className={classNames('delete', [styles.delete])}
              onClick={deleteOrganizationHandler}
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

export default EditOrganizationForm;
