export const formatTimeLocalized = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error(`Invalid date: ${dateString}`);
    return 'Неверное время';
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
