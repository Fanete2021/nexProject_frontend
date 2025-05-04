import { EmailConfirmFormAsync } from './ui/email-confirm-form/EmailConfirmForm.async.tsx';
import { confirmEmail } from './model/service/confirmEmail.ts';
import { sendCode } from './model/service/sendCode.ts';

export {
  EmailConfirmFormAsync as EmailConfirmForm,

  confirmEmail,
  sendCode
};
