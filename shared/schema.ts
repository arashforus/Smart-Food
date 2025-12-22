import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, numeric, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schemaVersions = pgTable("schema_versions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  version: text("version").notNull().unique(),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  description: text("description"),
});

export const branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  role: text("role").notNull().default("chef").default("chef"),
  avatar: text("avatar"),
  phone: text("phone"),
  branchId: varchar("branch_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: jsonb("name").notNull(),
  image: text("image"),
  order: numeric("order").notNull().default("1"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull(),
  name: jsonb("name").notNull(),
  shortDescription: jsonb("short_description").notNull(),
  longDescription: jsonb("long_description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  discountedPrice: numeric("discounted_price", { precision: 10, scale: 2 }),
  maxSelect: numeric("max_select"),
  image: text("image"),
  available: boolean("available").notNull().default(true),
  suggested: boolean("suggested").notNull().default(false),
  materials: text("materials").array(),
  types: text("types").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  tableNumber: varchar("table_number"),
  branchId: varchar("branch_id").notNull(),
  items: jsonb("items").notNull(),
  status: text("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const waiterRequests = pgTable("waiter_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tableId: varchar("table_id"),
  branchId: varchar("branch_id"),
  status: text("status").notNull().default("pending"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const tables = pgTable("tables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tableNumber: text("table_number").notNull(),
  branchId: varchar("branch_id").notNull(),
  capacity: numeric("capacity").notNull(),
  location: text("location"),
  status: text("status").notNull().default("available"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const languages = pgTable("languages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  order: numeric("order").notNull().default("1"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const foodTypes = pgTable("food_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: jsonb("name").notNull(),
  description: jsonb("description").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  order: numeric("order").notNull().default("1"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const materials = pgTable("materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: jsonb("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  isActive: boolean("is_active").notNull().default(true),
  order: numeric("order").notNull().default("1"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Branch = typeof branches.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type WaiterRequest = typeof waiterRequests.$inferSelect;
export type Table = typeof tables.$inferSelect;
export type Language = typeof languages.$inferSelect;
export type FoodType = typeof foodTypes.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type SchemaVersion = typeof schemaVersions.$inferSelect;
