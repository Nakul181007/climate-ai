import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'SUPPORTED':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        badge: 'bg-emerald-600 text-white',
        text: 'text-emerald-700',
        label: 'Supported',
      };
    case 'PARTIALLY_SUPPORTED':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        badge: 'bg-amber-600 text-white',
        text: 'text-amber-700',
        label: 'Partially Supported',
      };
    case 'INCONCLUSIVE':
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        badge: 'bg-slate-500 text-white',
        text: 'text-slate-600',
        label: 'Inconclusive',
      };
    case 'POTENTIAL_DISCREPANCY':
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-600',
        badge: 'bg-rose-600 text-white',
        text: 'text-rose-700',
        label: 'Potential Discrepancy',
      };
    default:
      return {
        bg: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'bg-gray-400',
        badge: 'bg-gray-500 text-white',
        text: 'text-gray-600',
        label: 'Pending Audit',
      };
  }
}

