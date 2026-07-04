import type { Transaction } from "@/lib/data";

/**
 * Convertit un tableau de transactions en chaîne CSV (RFC 4180).
 * Encodage UTF-8 avec BOM pour compatibilité Excel / LibreOffice.
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  const BOM = "﻿";

  const headers = [
    "ID",
    "Type",
    "Montant (FCFA)",
    "Catégorie",
    "Description",
    "Date",
    "Client / Fournisseur",
    "Statut",
  ];

  const escapeCell = (value: string | number | undefined): string => {
    const str = value === undefined || value === null ? "" : String(value);
    // Encapsuler entre guillemets si virgule, guillemet ou saut de ligne présents
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = transactions.map((tx) => [
    escapeCell(tx.id),
    escapeCell(tx.type === "revenu" ? "Revenu" : "Dépense"),
    escapeCell(tx.montant),
    escapeCell(tx.categorie),
    escapeCell(tx.description),
    escapeCell(tx.date),
    escapeCell(tx.client ?? ""),
    escapeCell(
      tx.statut === "validee"
        ? "Validée"
        : tx.statut === "en_attente"
        ? "En attente"
        : "Annulée"
    ),
  ]);

  const csvContent =
    BOM +
    [headers.map(escapeCell).join(","), ...rows.map((r) => r.join(","))].join(
      "\r\n"
    );

  return csvContent;
}

/**
 * Déclenche le téléchargement d'un fichier CSV dans le navigateur.
 * @param content  Contenu CSV (string)
 * @param filename Nom du fichier sans extension
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporte les transactions filtrées vers un fichier CSV.
 * Génère un nom de fichier horodaté automatiquement.
 */
export function exportTransactions(
  transactions: Transaction[],
  prefix = "comptrack-transactions"
): void {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `${prefix}-${date}`;
  const csv = transactionsToCSV(transactions);
  downloadCSV(csv, filename);
}
