import { FormikProps, FormikValues } from 'formik';

type Params = {
  checkTouched?: boolean;
}

/**
 * Если на поле кликали или пытались отправить форму, тогда отображаем ошибку
 */
export const isFormikErrorVisible = <T extends FormikValues>(
  formik: FormikProps<T>,
  field: string,
  params: Params = {}
): boolean => {
  const { checkTouched = true } = params;

  return ((checkTouched ? formik.touched[field] : false) || formik.submitCount > 0) && Boolean(formik.errors[field]);
};
