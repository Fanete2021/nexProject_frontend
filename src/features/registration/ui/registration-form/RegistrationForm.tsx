import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './RegistrationForm.module.scss';
import { useTranslation } from 'react-i18next';
import { registration } from '@/features/registration/ui/model/service/registration.ts';

const validationSchema = yup.object({
    email: yup.string().required('Почта обязателены'),
    username: yup.string().required('Имя пользовтеля обязателено'),
    password: yup.string().required('Пароль обязателен'),
    confirmPassword: yup.string().required('Подтверждение пароля обязателено'),
});

const RegistrationForm = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(registration(values));
            } catch (error) {
                console.error(error);
            }
        },
    });

    const onSubmit = (e) => {
        e.preventDefault();
        formik.handleSubmit();
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Почта')}</div>
                <OutlinedInput
                    endAdornment={
                        <InputAdornment position="end">
                            <></>
                        </InputAdornment>
                    }
                    id="email"
                    placeholder={t('Почта')}
                    fullWidth
                    name="email"
                    classes={{
                        root: styles.input
                    }}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Имя пользователя')}</div>
                <OutlinedInput
                    endAdornment={
                        <InputAdornment position="end">
                            <></>
                        </InputAdornment>
                    }
                    id="username"
                    placeholder={t('Имя пользователя')}
                    fullWidth
                    name="username"
                    classes={{
                        root: styles.input
                    }}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Пароль')}</div>
                <OutlinedInput
                    endAdornment={
                        <InputAdornment position="end">
                            <></>
                        </InputAdornment>
                    }
                    id="password"
                    placeholder={t('Пароль')}
                    fullWidth
                    name="password"
                    classes={{
                        root: styles.input
                    }}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    type="password"
                />
            </FormControl>

            <FormControl
                fullWidth
                className={styles.InputWrapper}
            >
                <div className={styles.label}>{t('Подтверждение пароля')}</div>
                <OutlinedInput
                    endAdornment={
                        <InputAdornment position="end">
                            <></>
                        </InputAdornment>
                    }
                    id="confirmPassword"
                    placeholder={t('Повторите пароль')}
                    fullWidth
                    name="confirmPassword"
                    classes={{
                        root: styles.input
                    }}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    type="password"
                />
            </FormControl>

            <button
                className={styles.submit}
                type={'submit'}
                onClick={onSubmit}
            >
                {t('Создать')}
            </button>
        </form>
    );
};

export default RegistrationForm;
