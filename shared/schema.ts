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
  owner: text("owner"),
  ownerPhone: text("owner_phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  role: text("role").notNull().default("chef"),
  avatar: text("avatar"),
  phone: text("phone"),
  branchId: varchar("branch_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  generalName: text("general_name").notNull().default(""),
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
  isNew: boolean("is_new").notNull().default(false),
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
  nativeName: text("native_name").default(""),
  direction: text("direction").default("ltr"),
  flagImage: text("flag_image"),
  isActive: boolean("is_active").notNull().default(true),
  isDefault: boolean("is_default").default(false),
  order: numeric("order").notNull().default("1"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const foodTypes = pgTable("food_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  generalName: text("general_name").notNull().default(""),
  name: jsonb("name").notNull(),
  description: jsonb("description").notNull(),
  icon: text("icon"),
  color: text("color").default("#4CAF50"),
  isActive: boolean("is_active").notNull().default(true),
  order: numeric("order").notNull().default("1"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const materials = pgTable("materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  generalName: text("general_name").notNull().default(""),
  name: jsonb("name").notNull(),
  icon: text("icon"),
  color: text("color").default("#FF6B6B"),
  isActive: boolean("is_active").notNull().default(true),
  order: numeric("order").notNull().default("1"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  primaryColor: text("primary_color").notNull().default("#4CAF50"),
  timezone: text("timezone").notNull().default("UTC"),
  favicon: text("favicon"),
  currencyName: text("currency_name").notNull().default("US Dollar"),
  currencySymbol: text("currency_symbol").notNull().default("$"),
  licenseKey: text("license_key"),
  licenseExpiryDate: timestamp("license_expiry_date"),
  defaultLanguage: text("default_language").notNull().default("en"),
  restaurantName: text("restaurant_name"),
  restaurantDescription: text("restaurant_description"),
  restaurantAddress: text("restaurant_address"),
  restaurantPhone: text("restaurant_phone"),
  restaurantEmail: text("restaurant_email"),
  restaurantHours: text("restaurant_hours"),
  restaurantLogo: text("restaurant_logo"),
  restaurantBackgroundImage: text("restaurant_background_image"),
  restaurantMapLat: numeric("restaurant_map_lat"),
  restaurantMapLng: numeric("restaurant_map_lng"),
  restaurantInstagram: text("restaurant_instagram"),
  restaurantWhatsapp: text("restaurant_whatsapp"),
  restaurantTelegram: text("restaurant_telegram"),
  restaurantGoogleMapsUrl: text("restaurant_google_maps_url"),
  loginBackgroundImage: text("login_background_image"),
  showLoginTitle: boolean("show_login_title").notNull().default(true),
  loginTitle: text("login_title").notNull().default("Welcome"),
  showLoginResetPassword: boolean("show_login_reset_password").notNull().default(true),
  qrShowLogo: boolean("qr_show_logo").notNull().default(true),
  qrLogo: text("qr_logo"),
  qrShowTitle: boolean("qr_show_title").notNull().default(true),
  qrShowDescription: boolean("qr_show_description").notNull().default(true),
  qrShowAnimatedText: boolean("qr_show_animated_text").notNull().default(true),
  qrAnimatedTexts: text("qr_animated_texts").array().notNull().default(sql`ARRAY['Welcome', 'Discover our Menu']::text[]`),
  qrMediaUrl: text("qr_media_url"),
  qrMediaType: text("qr_media_type"), // 'image' | 'video'
  qrTextColor: text("qr_text_color").notNull().default("#000000"),
  qrEyeBorderColor: text("qr_eye_border_color").notNull().default("#000000"),
  qrEyeDotColor: text("qr_eye_dot_color").notNull().default("#000000"),
  qrEyeBorderShape: text("qr_eye_border_shape").notNull().default("square"),
  qrEyeDotShape: text("qr_eye_dot_shape").notNull().default("square"),
  qrDotsStyle: text("qr_dots_style").notNull().default("square"),
  qrCenterType: text("qr_center_type").notNull().default("logo"), // 'none' | 'logo' | 'text'
  qrCenterText: text("qr_center_text"),
  qrShowCallWaiter: boolean("qr_show_call_waiter").notNull().default(true),
  qrShowAddressPhone: boolean("qr_show_address_phone").notNull().default(true),
  showMenuInstagram: boolean("show_menu_instagram").notNull().default(true),
  showMenuWhatsapp: boolean("show_menu_whatsapp").notNull().default(true),
  showMenuTelegram: boolean("show_menu_telegram").notNull().default(true),
  showMenuLanguageSelector: boolean("show_menu_language_selector").notNull().default(true),
  showMenuThemeSwitcher: boolean("show_menu_theme_switcher").notNull().default(true),
  menuDefaultTheme: text("menu_default_theme").notNull().default("light"),
  menuBackgroundType: text("menu_background_type").notNull().default("default"),
  menuBackgroundColor: text("menu_background_color"),
  menuGradientStart: text("menu_gradient_start"),
  menuGradientEnd: text("menu_gradient_end"),
  menuBackgroundImage: text("menu_background_image"),
  kdShowTableNumber: boolean("kd_show_table_number").notNull().default(true),
  kdShowOrderTime: boolean("kd_show_order_time").notNull().default(true),
  kdShowClock: boolean("kd_show_clock").notNull().default(true),
  kdShowNotes: boolean("kd_show_notes").notNull().default(true),
  kdHasPendingStatus: boolean("kd_has_pending_status").notNull().default(true),
  kdShowRecentlyCompleted: boolean("kd_show_recently_completed").notNull().default(true),
  kdPendingColor: text("kd_pending_color").notNull().default("#FF9800"),
  kdPreparingColor: text("kd_preparing_color").notNull().default("#2196F3"),
  kdReadyColor: text("kd_ready_color").notNull().default("#4CAF50"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
  phone: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({ 
  id: true,
  createdAt: true 
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Setting = typeof settings.$inferSelect;
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
