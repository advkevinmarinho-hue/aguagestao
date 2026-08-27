import { describe, expect, it } from "vitest";
import { createMonthlyReportHtml } from "../lib/report-document";

describe("monthly report document", () => {
  const metrics = { netResultCents: 12500, revenueCents: 30000, salesCount: 4, soldStockUnits: 8, ticketAverageCents: 7500, inventoryValueCents: 16000, lowStockCount: 1 };
  const products = [{ productName: "Galão 20L", unitsSold: 8, currentStockUnits: 3, inventoryValueCents: 2400, revenueCents: 30000, isLowStock: true, hasNoSales: false }];

  it("contains the business summary and product table", () => {
    const html = createMonthlyReportHtml({ businessName: "SK Água", monthLabel: "agosto de 2026", metrics, products, recommendations: ["Repor galões"] });
    expect(html).toContain("SK Água");
    expect(html).toContain("agosto de 2026");
    expect(html).toContain("R$");
    expect(html).toContain("300,00");
    expect(html).toContain("Galão 20L");
    expect(html).toContain("Repor galões");
  });

  it("escapes user-provided business and product text", () => {
    const html = createMonthlyReportHtml({ businessName: "<script>alert(1)</script>", monthLabel: "agosto", metrics, products: [{ ...products[0], productName: "<img src=x onerror=alert(1)>" }], recommendations: ["<b>não executar</b>"] });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).not.toContain("<img src=x onerror=alert(1)>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("renders an empty product state and fallback recommendation", () => {
    const html = createMonthlyReportHtml({ businessName: "SK Água", monthLabel: "agosto", metrics, products: [], recommendations: [] });
    expect(html).toContain("Nenhum produto cadastrado");
    expect(html).toContain("Registre vendas e movimentações");
  });
});
