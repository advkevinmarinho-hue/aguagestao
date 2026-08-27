import { relations } from "drizzle-orm";
import { businesses, financialEntries, lessonProgress, productExitModes, products, saleItems, sales, users } from "./schema";

export const businessRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, { fields: [businesses.ownerUserId], references: [users.id] }),
  products: many(products),
  sales: many(sales),
  financialEntries: many(financialEntries),
  lessonProgress: many(lessonProgress),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  business: one(businesses, { fields: [products.businessId], references: [businesses.id] }),
  exitModes: many(productExitModes),
  saleItems: many(saleItems),
}));

export const exitModeRelations = relations(productExitModes, ({ one }) => ({
  product: one(products, { fields: [productExitModes.productId], references: [products.id] }),
}));

export const saleRelations = relations(sales, ({ one, many }) => ({
  business: one(businesses, { fields: [sales.businessId], references: [businesses.id] }),
  items: many(saleItems),
}));

export const saleItemRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, { fields: [saleItems.saleId], references: [sales.id] }),
  product: one(products, { fields: [saleItems.productId], references: [products.id] }),
}));
