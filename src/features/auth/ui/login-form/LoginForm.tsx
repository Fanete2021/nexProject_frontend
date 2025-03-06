import {useFormik} from "formik";
import * as yup from "yup";
import {FormControl, InputAdornment, OutlinedInput} from "@mui/material";
import {useAppDispatch} from "@/shared/lib/hooks/useAppDispatch.ts";
import styles from './LoginForm.module.scss';
import {login} from "@/features/auth/ui/model/service/login.ts";

const validationSchema = yup.object({
  phoneNumberOrMail: yup.string().required('Почта или телефон обязателены'),
  password: yup.string().required('Пароль обязателен'),
});

const LoginForm = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      phoneNumberOrMail: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(login(values));
      } catch (error) {
        console.error(error);
      }
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <FormControl
        fullWidth
        className={styles.InputWrapper}
      >
        <div className={styles.label}>Почта / телефон</div>
        <OutlinedInput
          endAdornment={
            <InputAdornment position="end">
              <></>
            </InputAdornment>
          }
          id="phoneNumberOrMail"
          placeholder="Почта или телефон"
          fullWidth
          name="phoneNumberOrMail"
          classes={{
            root: styles.input
          }}
          value={formik.values.phoneNumberOrMail}
          onChange={formik.handleChange}
        />
      </FormControl>

      <FormControl
        fullWidth
        className={styles.InputWrapper}
      >
        <div className={styles.label}>Пароль</div>
        <OutlinedInput
          endAdornment={
            <InputAdornment position="end">
              <></>
            </InputAdornment>
          }
          id="password"
          placeholder="Пароль"
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

      <button
        className={styles.submit}
        type={'submit'}
        onClick={onSubmit}
      >
        Войти
      </button>
    </form>
  );
};

export default LoginForm;
