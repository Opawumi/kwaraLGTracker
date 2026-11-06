// Utility functions for the platform

/**
 * Format a number as Nigerian Naira currency.
 */
export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format a number in abbreviated form (e.g., 1.2B, 350M).
 */
export function formatNairaShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    return '₦' + (amount / 1_000_000_000).toFixed(2) + 'B';
  }
  if (amount >= 1_000_000) {
    return '₦' + (amount / 1_000_000).toFixed(1) + 'M';
  }
  if (amount >= 1_000) {
    return '₦' + (amount / 1_000).toFixed(0) + 'K';
  }
  return '₦' + amount.toLocaleString('en-NG');
}

/**
 * Format a date string nicely.
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get status badge class.
 */
export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Published':
      return 'badge bg-success';
    case 'Draft':
      return 'badge bg-warning text-dark';
    default:
      return 'badge bg-secondary';
  }
}

/**
 * Generate pagination range.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | '...')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return pages;
}
