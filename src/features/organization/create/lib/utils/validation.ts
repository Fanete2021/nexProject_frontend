import { Validation } from '@/shared/types/validation.ts';

export const isOrganizationNameValid = (orgName: string): Validation[] => {
  const lengthValid = /^.{3,64}$/.test(orgName);
  const charsValid = /^[\p{L}0-9&_-]+$/u.test(orgName);

  return [
    {
      text: 'От 3 до 64 символов',
      isError: !lengthValid
    },
    {
      text: 'Используются только буквы, цифры и специальные символы (&-_)',
      isError: !charsValid
    },
  ];
};

export const isOrganizationDescriptionValid = (orgName: string): Validation[] => {
  const lengthValid = /^.{0,255}$/.test(orgName);

  return [
    {
      text: 'до 255 символов',
      isError: !lengthValid
    }
  ];
};
