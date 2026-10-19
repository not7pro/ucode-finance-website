import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats minor currency units (cents) into clean, standard currency strings
 * e.g. 7330000 cents in LKR -> "73,300.00 LKR"
 */
export function formatCurrency(
  amountCents: number,
  currency: "LKR" | "SAR" | "USD" = "LKR",
  includeDecimals: boolean = true
): string {
  const value = amountCents / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(value);

  return `${formatted} ${currency}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
