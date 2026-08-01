import {
  clients,
  expenses,
  invoices,
  sales,
  sumMoney,
} from "@/lib/comptrack-data";

export function GET() {
  const revenue = sumMoney(sales.map((sale) => sale.total));
  const expenseTotal = sumMoney(expenses.map((expense) => expense.total));
  const openInvoices = sumMoney(
    invoices
      .filter((invoice) => invoice.status !== "paid")
      .map((invoice) => invoice.total),
  );

  return Response.json({
    generatedAt: new Date().toISOString(),
    clients: clients.length,
    invoices: invoices.length,
    sales: sales.length,
    expenses: expenses.length,
    revenue,
    expenseTotal,
    openInvoices,
  });
}
