import { Validation } from '@/shared/types/validation.ts';

export const isTaskBoardNameValid = (taskBoardName: string): Validation[] => {
  const lengthValid = /^.{6,20}$/.test(taskBoardName);

  return [
    {
      text: 'От 6 до 20 символов',
      isError: !lengthValid
    },
  ];
};
