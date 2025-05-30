/**
 * Форматирование даты в формате hh:mm или hh:mm dd.mm.yyyy
 */
export const formatTimeLocalized = (
  dateInput: Date | string,
  config?: {
    includeDate: boolean
  } = {
    includeDate: false
  }
): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!config.includeDate) {
    return timeString;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${timeString} ${day}.${month}.${year}`;
};
