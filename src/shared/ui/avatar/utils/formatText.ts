/**
 * Форматирует текст для аватара
 * @param text - текст
 * @returns Инициал(ы) для аватара
 */
export const formatText = (text?: string): string => {
  if (!text) return '';

  const words = text.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0][0]?.toUpperCase() || '';
  }

  return `${words[0][0]?.toUpperCase() || ''}.${words[1][0]?.toUpperCase() || ''}`;
};
