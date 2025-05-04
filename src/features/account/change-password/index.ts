import { SendCodeFormAsync } from './ui/send-code-form/SendCodeForm.async.tsx';
import { ChangePasswordFormAsync } from './ui/change-password-form/ChangePasswordForm.async.tsx';
import { changePassword } from './model/service/changePassword.ts';
import { RegistrationFormProps } from './ui/change-password-form/ChangePasswordForm.tsx';
import { newPassword } from './model/service/newPassword.ts';

export type {
  RegistrationFormProps
};

export {
  SendCodeFormAsync as SendCodeForm,
  ChangePasswordFormAsync as ChangePasswordForm,

  changePassword,
  newPassword
};
