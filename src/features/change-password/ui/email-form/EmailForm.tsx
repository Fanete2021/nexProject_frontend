import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useTranslation } from 'react-i18next';
import { CustomInput, icons, SvgIcon } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { changePassword } from '../../model/service/changePassword.ts';
import { isFormikErrorVisible } from '@/shared/lib/utils/isFormikErrorVisible.ts';

const validationSchema = yup.object({
    email: yup.string().email('Почта невалидна').required('Почта обязательна'),
});

const EmailForm = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [error, setError] = useState<string>('');
    const [successText, setSuccessText] = useState<string>('');

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                await dispatch(changePassword(values));

                setSuccessText('Код отправлен');
            } catch (error) {
                setError(error);
            }
        },
    });

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        formik.handleSubmit();
    }, [formik.handleSubmit]);

    return (
        <form className="form" onSubmit={onSubmit}>
            {successText &&
                <div className="success">{t(successText)}</div>
            }
            {error &&
                <div className="error">{error}</div>
            }

            <FormControl
                fullWidth
                className="FieldWrapper"
            >
                <div className="label">
                    {t('Почта')}<br/>
                    {isFormikErrorVisible(formik, 'email') &&
                        <div className="error">{t(formik.errors.email)}</div>
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
            >
                {t('Сменить пароль')}
            </button>
        </form>
    );
};

export default EmailForm;
