const RELATIVE_TIME = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const MS_PER_UNIT = {
  year: 1000 * 60 * 60 * 24 * 365,
  month: 1000 * 60 * 60 * 24 * 30,
  week: 1000 * 60 * 60 * 24 * 7,
  day: 1000 * 60 * 60 * 24,
  hour: 1000 * 60 * 60,
  minute: 1000 * 60,
  second: 1000
};

const ORDERED_UNITS = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];

export function formatDistanceToNow(value) {
  const date = value instanceof Date ? value : new Date(value);
  const diff = date - new Date();

  for (const unit of ORDERED_UNITS) {
    const ms = MS_PER_UNIT[unit];
    if (Math.abs(diff) > ms || unit === 'second') {
      return RELATIVE_TIME.format(Math.round(diff / ms), unit);
    }
  }
  return '';
}

export function formatDate(value) {
  if (!value) {
    return 'Soon';
  }
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}
