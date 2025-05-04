import { Validation } from '@/shared/types/validation.ts';

/**
 * Валидация для форм.
 */
export const isPasswordValid = (password: string): Validation[] => {
  const lengthValid = password.length >= 6 && password.length <= 15;
  const charsValid = /^[a-zA-Z0-9!@#$%^&*-]+$/.test(password);

  return [
    {
      text: 'От 6 до 15 символов',
      isError: !lengthValid
    },
    {
      text: 'Используются только латинские буквы, цифры и специальные символы (!@#$%^&*-)',
      isError: !charsValid
    }
  ];
};

export const isUsernameValid = (username: string): Validation[] => {
  const lengthValid = username.length >= 3 && username.length <= 15;
  const charsValid = /^[a-zA-Z0-9-_]+$/.test(username);
  const startsWithLetterValid = /^[a-zA-Z]/.test(username);

  return [
    {
      text: 'От 3 до 15 символов',
      isError: !lengthValid
    },
    {
      text: 'Используются только латинские буквы, цифры и специальные символы ( - _ )',
      isError: !charsValid
    },
    {
      text: 'Начинается с буквы',
      isError: !startsWithLetterValid
    }
  ];
};

export const isOrganizationNameValid = (orgName: string): Validation[] => {
  const lengthValid = orgName.length >= 6 && orgName.length <= 15;
  const charsValid = /^[a-zA-Z0-9!@#$%^&*-]+$/.test(orgName);

  return [
    {
      text: 'От 6 до 15 символов',
      isError: !lengthValid
    },
    {
      text: 'Используются только латинские буквы, цифры и специальные символы (!@#$%^&*-)',
      isError: !charsValid
    }
  ];
};
