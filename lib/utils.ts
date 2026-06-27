import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate un montant en FCFA */
export function formatMontant(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant) + " FCFA";
}

/** Formate une date en français */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

/** Formate une date courte */
export function formatDateCourt(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(dateStr));
}

/** Calcule la variation en % */
export function calcVariation(actuel: number, precedent: number): number {
  if (precedent === 0) return 0;
  return Math.round(((actuel - precedent) / precedent) * 100);
}
