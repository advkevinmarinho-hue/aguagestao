export type FinancialEntryType = "cost" | "expense" | "withdrawal" | "capital" | "reserve";
export type PaymentMethod = "cash" | "pix" | "card" | "credit";

export type ProductSnapshot = {
  id: number;
  name: string;
  unitCostCents: number;
  stockUnits: number;
  minimumStockUnits: number;
  active: boolean;
};

export type SaleSnapshot = { id: number; totalCents: number; createdAt: Date | string };
export type SaleItemSnapshot = {
  saleId: number;
  productId: number;
  productNameSnapshot: string;
  quantity: number;
  priceCents: number;
  unitCostCents: number;
  subtotalCents: number;
  stockUnits: number;
};
export type FinancialEntrySnapshot = {
  type: FinancialEntryType;
  amountCents: number;
  occurredAt: Date | string;
};

export const formatBRL = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export function getMaximumQuantity(availableStockUnits: number, stockUnitsPerSale: number) {
  if (stockUnitsPerSale <= 0) return 0;
  return Math.max(0, Math.floor(availableStockUnits / stockUnitsPerSale));
}

export function getMonthRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
}

function isBetween(value: Date | string, start?: Date, end?: Date) {
  const date = new Date(value);
  return (!start || date >= start) && (!end || date < end);
}

export function calculateMetrics(
  products: ProductSnapshot[],
  sales: SaleSnapshot[],
  saleItems: SaleItemSnapshot[],
  entries: FinancialEntrySnapshot[],
  range?: { start: Date; end: Date },
) {
  const filteredSales = sales.filter((sale) => isBetween(sale.createdAt, range?.start, range?.end));
  const includedSaleIds = new Set(filteredSales.map((sale) => sale.id));
  const filteredItems = saleItems.filter((item) => includedSaleIds.has(item.saleId));
  const filteredEntries = entries.filter((entry) => isBetween(entry.occurredAt, range?.start, range?.end));

  const revenueCents = filteredSales.reduce((total, sale) => total + sale.totalCents, 0);
  const productCostCents = filteredItems.reduce(
    (total, item) => total + item.unitCostCents * item.quantity * item.stockUnits,
    0,
  );
  const costEntriesCents = filteredEntries
    .filter((entry) => entry.type === "cost")
    .reduce((total, entry) => total + entry.amountCents, 0);
  const expenseCents = filteredEntries
    .filter((entry) => entry.type === "expense")
    .reduce((total, entry) => total + entry.amountCents, 0);
  const capitalCents = filteredEntries
    .filter((entry) => entry.type === "capital")
    .reduce((total, entry) => total + entry.amountCents, 0);
  const withdrawalCents = filteredEntries
    .filter((entry) => entry.type === "withdrawal")
    .reduce((total, entry) => total + entry.amountCents, 0);
  const reserveCents = filteredEntries
    .filter((entry) => entry.type === "reserve")
    .reduce((total, entry) => total + entry.amountCents, 0);

  const netResultCents = revenueCents - productCostCents - costEntriesCents - expenseCents;
  const inventoryValueCents = products.reduce(
    (total, product) => total + product.stockUnits * product.unitCostCents,
    0,
  );
  const soldStockUnits = filteredItems.reduce((total, item) => total + item.quantity * item.stockUnits, 0);

  return {
    revenueCents,
    netResultCents,
    netMargin: revenueCents > 0 ? netResultCents / revenueCents : null,
    cashCents: revenueCents + capitalCents - costEntriesCents - expenseCents - withdrawalCents - reserveCents,
    workingCapitalCents: Math.max(0, revenueCents + capitalCents - costEntriesCents - expenseCents - withdrawalCents - reserveCents),
    reserveCents,
    ticketAverageCents: filteredSales.length > 0 ? Math.round(revenueCents / filteredSales.length) : null,
    inventoryValueCents,
    salesCount: filteredSales.length,
    soldStockUnits,
    lowStockCount: products.filter((product) => product.stockUnits <= product.minimumStockUnits).length,
    productCostCents,
    costEntriesCents,
    expenseCents,
    capitalCents,
    withdrawalCents,
  };
}

export function createProductReport(
  products: ProductSnapshot[],
  saleItems: SaleItemSnapshot[],
  includedSaleIds: Set<number>,
) {
  return products.map((product) => {
    const items = saleItems.filter((item) => item.productId === product.id && includedSaleIds.has(item.saleId));
    const unitsSold = items.reduce((total, item) => total + item.quantity * item.stockUnits, 0);
    const revenueCents = items.reduce((total, item) => total + item.subtotalCents, 0);
    return {
      productId: product.id,
      productName: product.name,
      unitsSold,
      currentStockUnits: product.stockUnits,
      inventoryValueCents: product.stockUnits * product.unitCostCents,
      revenueCents,
      isLowStock: product.stockUnits <= product.minimumStockUnits,
      hasNoSales: unitsSold === 0,
    };
  });
}
