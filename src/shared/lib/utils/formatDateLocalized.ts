/**
 * Получение даты в засимости от текущей даты, в форматах:
 * день месяц
 * день месяц год
 */
export const formatDateLocalized = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  if (isNaN(date.getTime())) {
    console.error(`Invalid date: ${dateString}`);
    return 'Неверная дата';
  }

  if (isCurrentYear) {
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date);
  }

  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};
