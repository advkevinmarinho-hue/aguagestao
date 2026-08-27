import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const businesses = mysqlTable(
  "businesses",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerUserId: int("ownerUserId").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    monthlyGoalCents: int("monthlyGoalCents").notNull().default(0),
    reserveGoalCents: int("reserveGoalCents").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("businesses_owner_user_unique").on(table.ownerUserId)],
);

export const products = mysqlTable(
  "products",
  {
    id: int("id").autoincrement().primaryKey(),
    businessId: int("businessId").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    category: varchar("category", { length: 80 }).notNull().default("Galões de água"),
    defaultPriceCents: int("defaultPriceCents").notNull(),
    unitCostCents: int("unitCostCents").notNull(),
    stockUnits: int("stockUnits").notNull().default(0),
    minimumStockUnits: int("minimumStockUnits").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("products_business_idx").on(table.businessId)],
);

export const productExitModes = mysqlTable(
  "product_exit_modes",
  {
    id: int("id").autoincrement().primaryKey(),
    businessId: int("businessId").notNull(),
    productId: int("productId").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    priceCents: int("priceCents").notNull(),
    stockUnits: int("stockUnits").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("exit_modes_product_idx").on(table.productId), index("exit_modes_business_idx").on(table.businessId)],
);

export const sales = mysqlTable(
  "sales",
  {
    id: int("id").autoincrement().primaryKey(),
    businessId: int("businessId").notNull(),
    userId: int("userId").notNull(),
    totalCents: int("totalCents").notNull(),
    paymentMethod: mysqlEnum("paymentMethod", ["cash", "pix", "card", "credit"]).notNull(),
    note: varchar("note", { length: 280 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("sales_business_created_idx").on(table.businessId, table.createdAt)],
);

export const saleItems = mysqlTable(
  "sale_items",
  {
    id: int("id").autoincrement().primaryKey(),
    saleId: int("saleId").notNull(),
    productId: int("productId").notNull(),
    productNameSnapshot: varchar("productNameSnapshot", { length: 120 }).notNull(),
    quantity: int("quantity").notNull(),
    priceCents: int("priceCents").notNull(),
    unitCostCents: int("unitCostCents").notNull(),
    subtotalCents: int("subtotalCents").notNull(),
    exitModeId: int("exitModeId").notNull(),
    exitModeNameSnapshot: varchar("exitModeNameSnapshot", { length: 120 }).notNull(),
    stockUnits: int("stockUnits").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("sale_items_sale_idx").on(table.saleId), index("sale_items_product_idx").on(table.productId)],
);

export const financialEntries = mysqlTable(
  "financial_entries",
  {
    id: int("id").autoincrement().primaryKey(),
    businessId: int("businessId").notNull(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", ["cost", "expense", "withdrawal", "capital", "reserve"]).notNull(),
    amountCents: int("amountCents").notNull(),
    description: varchar("description", { length: 280 }).notNull(),
    occurredAt: timestamp("occurredAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("financial_entries_business_date_idx").on(table.businessId, table.occurredAt)],
);

export const lessonProgress = mysqlTable(
  "lesson_progress",
  {
    id: int("id").autoincrement().primaryKey(),
    businessId: int("businessId").notNull(),
    userId: int("userId").notNull(),
    lessonKey: varchar("lessonKey", { length: 80 }).notNull(),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("lesson_progress_unique").on(table.businessId, table.userId, table.lessonKey)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Business = typeof businesses.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductExitMode = typeof productExitModes.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type SaleItem = typeof saleItems.$inferSelect;
export type FinancialEntry = typeof financialEntries.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
