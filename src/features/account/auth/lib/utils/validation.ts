import { Validation } from '@/shared/types/validation.ts';

export const isPasswordValid = (password: string): Validation[] => {
  const lengthValid = /^.{6,15}$/.test(password);
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
  const lengthValid = /^.{3,15}$/.test(username);
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
