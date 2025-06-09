import { Validation } from '@/shared/types/validation.ts';

export const isTaskNameValid = (taskName: string): Validation[] => {
  const lengthValid = /^.{6,20}$/.test(taskName);

  return [
    {
      text: 'От 6 до 20 символов',
      isError: !lengthValid
    },
  ];
};
