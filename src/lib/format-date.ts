/**
 * Formats a Date to Italian long format: "14 marzo 2026"
 * Used for all user-facing date displays.
 * Frontmatter uses ISO format; this helper is the single UI formatter.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
