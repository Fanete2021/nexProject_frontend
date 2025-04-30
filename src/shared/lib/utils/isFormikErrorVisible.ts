import { FormikProps, FormikValues } from 'formik';

/**
 * Если на поле кликали или пытались отправить форму, тогда отображаем ошибку
 */
export const isFormikErrorVisible = <T extends FormikValues>(formik: FormikProps<T>, field: string): boolean => {
  return (formik.touched[field] || formik.submitCount > 0) && Boolean(formik.errors[field]);
};
