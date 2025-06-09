import { Validation } from '@/shared/types/validation.ts';

export const isTeamNameValid = (teamName: string): Validation[] => {
  const lengthValid = /^.{6,20}$/.test(teamName);

  return [
    {
      text: 'От 6 до 20 символов',
      isError: !lengthValid
    },
  ];
};

export const isTeamDescriptionValid = (teamDescription: string): Validation[] => {
  const lengthValid = /^.{0,255}$/.test(teamDescription);

  return [
    {
      text: 'до 255 символов',
      isError: !lengthValid
    }
  ];
};

export const isTeamTagValid = (teamTag: string): Validation[] => {
  const lengthValid = /^.{0,50}$/.test(teamTag);

  return [
    {
      text: 'до 50 символов',
      isError: !lengthValid
    }
  ];
};
