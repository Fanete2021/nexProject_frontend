import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Получение времени в засимости от текущей даты, в форматах:
 * hh:mm
 * вчера hh:mm
 * day, hh:mm
 * DD.MM.YYYY
 */
export const formatLastMessageDateTime = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm', { locale: ru });
  }

  if (isYesterday(date)) {
    return `вчера, ${format(date, 'HH:mm', { locale: ru })}`;
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return `${format(date, 'EE', { locale: ru }).slice(0, 2)}, ${format(date, 'HH:mm', { locale: ru })}`;
  }

  return format(date, 'dd.MM.yyyy', { locale: ru });
};
