// Clayton Art House — Utility Formatters

/**
 * Format currency in Egyptian Pounds (EGP)
 */
export function formatEGP(amount: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0
  }).format(amount).replace('EGP', '').trim() + ' EGP';
}

/**
 * Format date for Alexandria sessions (e.g., Saturday, 14 Oct 2026)
 */
export function formatSessionDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Format time (e.g., 5:00 PM)
 */
export function formatSessionTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Format time window (e.g., 5:00 PM – 7:30 PM)
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatSessionTime(startTime)} – ${formatSessionTime(endTime)}`;
}

/**
 * Format relative lead time or duration
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours > 0 && remainingMins > 0) {
    return `${hours}h ${remainingMins}m`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} mins`;
}

/**
 * Format Egyptian phone number display
 */
export function formatEgyptianPhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.startsWith('+20')) {
    return `+20 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith('01')) {
    return `0${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}
