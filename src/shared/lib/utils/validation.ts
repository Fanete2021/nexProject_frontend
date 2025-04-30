/**
 * Валидация для форм авторизации/регистрации.
 */
const passwordLengthValidText = 'От 6 до 15 символов';
const passwordCharsValidText = 'Используются только латинские буквы, цифры и специальные символы (!@#$%^&*-)';
export const isPasswordValid = (password: string) => {
  const passwordLengthValid = password.length >= 6 && password.length <= 15;
  const passwordCharsValid = /^[a-zA-Z0-9!@#$%^&*-]+$/.test(password);

  return { passwordLengthValid, passwordLengthValidText, passwordCharsValid, passwordCharsValidText };
};

const usernameLengthValidText = 'От 3 до 15 символов';
const usernameCharsValidText = 'Используются только латинские буквы, цифры и специальные символы ( - _ )';
const usernameStartsWithLetterText = 'Начинается с буквы';
export const isUsernameValid = (username: string) => {
  const usernameLengthValid = username.length >= 3 && username.length <= 15;
  const usernameCharsValid = /^[a-zA-Z0-9-_]+$/.test(username);
  const usernameStartsWithLetter = /^[a-zA-Z]/.test(username);

  return {
    usernameLengthValid,
    usernameLengthValidText,
    usernameCharsValid,
    usernameCharsValidText,
    usernameStartsWithLetter,
    usernameStartsWithLetterText
  };
};
