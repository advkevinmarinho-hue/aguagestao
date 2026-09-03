import { describe, expect, it } from "vitest";
import { calculateMetrics, createProductReport, getMaximumQuantity, getMonthRange } from "../shared/business";

const products = [
  { id: 1, name: "Galão 20L", unitCostCents: 800, stockUnits: 10, minimumStockUnits: 3, active: true },
  { id: 2, name: "Galão reserva", unitCostCents: 1000, stockUnits: 2, minimumStockUnits: 2, active: true },
];

const sales = [
  { id: 1, totalCents: 3000, createdAt: "2026-08-05T12:00:00.000Z" },
  { id: 2, totalCents: 4500, createdAt: "2026-08-20T12:00:00.000Z" },
  { id: 3, totalCents: 9000, createdAt: "2026-09-01T12:00:00.000Z" },
];

const saleItems = [
  { saleId: 1, productId: 1, productNameSnapshot: "Galão 20L", quantity: 2, priceCents: 1500, unitCostCents: 800, subtotalCents: 3000, stockUnits: 1 },
  { saleId: 2, productId: 1, productNameSnapshot: "Galão 20L", quantity: 1, priceCents: 4500, unitCostCents: 800, subtotalCents: 4500, stockUnits: 2 },
  { saleId: 3, productId: 2, productNameSnapshot: "Galão reserva", quantity: 1, priceCents: 9000, unitCostCents: 1000, subtotalCents: 9000, stockUnits: 1 },
];

describe("business edge cases", () => {
  it.each([
    [10, 1, 10], [10, 2, 5], [9, 2, 4], [0, 1, 0], [-5, 1, 0], [10, 0, 0], [10, -1, 0],
  ])("calculates maximum quantity for available=%s and unitsPerSale=%s", (available, unitsPerSale, expected) => {
    expect(getMaximumQuantity(available, unitsPerSale)).toBe(expected);
  });

  it("uses only sales and entries inside the requested month", () => {
    const metrics = calculateMetrics(products, sales, saleItems, [
      { type: "expense", amountCents: 500, occurredAt: "2026-08-10T10:00:00.000Z" },
      { type: "capital", amountCents: 2000, occurredAt: "2026-09-02T10:00:00.000Z" },
    ], getMonthRange(2026, 8));
    expect(metrics.revenueCents).toBe(7500);
    expect(metrics.salesCount).toBe(2);
    expect(metrics.soldStockUnits).toBe(4);
    expect(metrics.expenseCents).toBe(500);
    expect(metrics.capitalCents).toBe(0);
  });

  it("calculates product cost using quantity and stock consumption", () => {
    const metrics = calculateMetrics(products, sales.slice(0, 2), saleItems.slice(0, 2), []);
    expect(metrics.productCostCents).toBe(800 * 2 * 1 + 800 * 1 * 2);
    expect(metrics.netResultCents).toBe(7500 - metrics.productCostCents);
  });

  it("keeps no-sales and low-stock indicators stable for every product", () => {
    const report = createProductReport(products, saleItems.slice(0, 2), new Set([1, 2]));
    expect(report[0]).toMatchObject({ unitsSold: 4, currentStockUnits: 10, isLowStock: false, hasNoSales: false });
    expect(report[1]).toMatchObject({ unitsSold: 0, currentStockUnits: 2, isLowStock: true, hasNoSales: true });
  });

  it("does not create a percentage or ticket average without revenue or sales", () => {
    const metrics = calculateMetrics(products, [], [], []);
    expect(metrics.netMargin).toBeNull();
    expect(metrics.ticketAverageCents).toBeNull();
    expect(metrics.revenueCents).toBe(0);
    expect(metrics.cashCents).toBe(0);
  });

  it("never exposes negative working capital", () => {
    const metrics = calculateMetrics(products, [], [], [
      { type: "expense", amountCents: 10000, occurredAt: "2026-08-10T10:00:00.000Z" },
      { type: "withdrawal", amountCents: 1000, occurredAt: "2026-08-10T10:00:00.000Z" },
    ]);
    expect(metrics.cashCents).toBe(-11000);
    expect(metrics.workingCapitalCents).toBe(0);
  });

  it("counts reserve as a cash allocation without reducing the result", () => {
    const metrics = calculateMetrics(products, [sales[0]], [saleItems[0]], [
      { type: "reserve", amountCents: 500, occurredAt: "2026-08-05T13:00:00.000Z" },
    ]);
    expect(metrics.netResultCents).toBe(3000 - 1600);
    expect(metrics.reserveCents).toBe(500);
    // O custo unitário impacta o resultado/margem; o caixa é reduzido por entradas financeiras reais.
    expect(metrics.cashCents).toBe(3000 - 500);
  });

  it("ignores cancelled sales from financial metrics and sold units", () => {
    const metrics = calculateMetrics(products, [{ ...sales[0], status: "cancelled" }], saleItems.slice(0, 1), []);
    expect(metrics.revenueCents).toBe(0);
    expect(metrics.salesCount).toBe(0);
    expect(metrics.soldStockUnits).toBe(0);
    expect(metrics.netMargin).toBeNull();
    expect(metrics.ticketAverageCents).toBeNull();
  });
});
