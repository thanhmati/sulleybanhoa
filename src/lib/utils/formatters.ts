import dayjs from 'dayjs';

export const formatDate = (value?: string | Date, format: string = 'DD/MM/YYYY HH:mm') =>
  dayjs(value).isValid() ? dayjs(value).format(format) : '-';

export const formatCurrency = (value?: number, locale = 'vi-VN', currency = 'VND') =>
  value == null
    ? '-'
    : new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
