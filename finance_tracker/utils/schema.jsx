import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const Periods = pgTable("periods", {
  id: serial("id").primaryKey(),             // Unique identifier for the period
  name: varchar("name").notNull(),           // Name of the period
  type: varchar("type").notNull(),           // Time frame type (weekly, monthly, yearly)
  startDate: varchar("startDate").notNull(), // Start date as a string
  endDate: varchar("endDate").notNull(),     // End date as a string
  createdBy: varchar("createdBy").notNull(), // The user who created the period
  createdAt: varchar("createdAt").default("NOW()"), // Use "NOW()" as a default timestamp string
});

export const PeriodSelected = pgTable("period_selected", {
  id: serial("id").primaryKey(),// Unique identifier for the selection
  createdBy: varchar("createdBy").notNull(),
  periodId: integer("period_id").references(() => Periods.id), // Links to the selected period
  createdAt: varchar("created_at").default("NOW()"),           // Timestamp of when the selection was made
  updatedAt: varchar("updated_at").default("NOW()") // Timestamp of when the selection was last updated
});

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
  periodId: integer("periodId").references(() => Periods.id), // Links to a period
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
  periodId: integer("periodId").references(() => Periods.id), // Links to a period
});

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
});
