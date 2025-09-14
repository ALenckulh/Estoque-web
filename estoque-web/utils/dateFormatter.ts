// utils/dateFormatter.ts
export interface DateParts {
  day: number;
  month: number;
  year: number;
}

export const parseDateString = (dateString: string): DateParts | null => {
  const cleanString = dateString.replace(/\D/g, '');
  
  if (cleanString.length < 6) return null;
  
  const day = parseInt(cleanString.substring(0, 2));
  const month = parseInt(cleanString.substring(2, 4)) - 1; // Mês começa em 0
  const year = parseInt(cleanString.substring(4, 8));
  
  // Validar se os valores são plausíveis
  if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) {
    return null;
  }
  
  return { day, month, year };
};

export const formatDateToDisplay = (date: Date | null, format: string): string => {
  if (!date || isNaN(date.getTime())) return '';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
};

export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const createDateFromParts = (parts: DateParts): Date => {
  return new Date(parts.year, parts.month, parts.day);
};