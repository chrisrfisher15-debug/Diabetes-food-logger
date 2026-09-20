export function formatDateTime(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTimeInput(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function combineDateAndTime(dateText: string, timeText: string, fallback: Date): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText.trim());
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(timeText.trim());
  if (!match || !timeMatch) {
    return fallback;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const next = new Date(year, month, day, hours, minutes, 0, 0);
  return Number.isNaN(next.getTime()) ? fallback : next;
}

export function formatUnits(units: number): string {
  const rounded = Number.isInteger(units) ? String(units) : units.toFixed(1).replace(/\.0$/, '');
  return `${rounded} unit${units === 1 ? '' : 's'}`;
}

export function formatCarbs(grams: number): string {
  const rounded = Number.isInteger(grams) ? String(grams) : grams.toFixed(1).replace(/\.0$/, '');
  return `${rounded} g carbs`;
}

export function totalCarbs(foods: { carbsGrams?: number }[]): number | undefined {
  const values = foods
    .map((food) => food.carbsGrams)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
  if (values.length === 0) {
    return undefined;
  }
  return values.reduce((sum, value) => sum + value, 0);
}
