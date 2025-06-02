/**
 * Date formatting utilities for consistent date display across the application
 */

/**
 * Format a date string or Date object to a localized date string
 * @param date - The date to format
 * @returns Formatted date string (e.g., "12/25/2023")
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

/**
 * Format a date string or Date object to a localized time string
 * @param date - The date to format
 * @returns Formatted time string (e.g., "2:30:45 PM")
 */
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString();
}

/**
 * Format a date string or Date object to a combined date and time string
 * @param date - The date to format
 * @returns Formatted date and time string (e.g., "Created 12/25/2023 at 2:30:45 PM")
 */
export function formatDateTime(date: string | Date, prefix: string = "Created"): string {
  return `${prefix} ${formatDate(date)} at ${formatTime(date)}`;
}

/**
 * Get a relative time string for a date (e.g., "2 days ago", "just now")
 * @param date - The date to get relative time for
 * @returns Relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  // For older dates, just show the formatted date
  return formatDate(date);
}