import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, branches, categories, items, orders, waiterRequests, tables, languages, foodTypes, materials, settings } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import type { StorageUser, StorageBranch, StorageCategory, StorageItem, StorageOrder, StorageTable, StorageLanguage, StorageFoodType, StorageMaterial, WaiterRequest, IStorage, DashboardMetrics, StorageSetting } from "./storage";

let db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    db = drizzle(pool);
  }
  return db;
}

import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DrizzleStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getSettings(): Promise<StorageSetting | undefined> {
    const db = getDb();
    const result = await db.select().from(settings).limit(1);
    if (result.length === 0) return undefined;
    const s = result[0];
    const mapSettings = (s: any): StorageSetting => ({
      ...s,
      favicon: s.favicon ?? undefined,
      licenseKey: s.licenseKey ?? undefined,
      licenseExpiryDate: s.licenseExpiryDate ?? undefined,
      restaurantLogo: s.restaurantLogo ?? undefined,
      restaurantBackgroundImage: s.restaurantBackgroundImage ?? undefined,
      restaurantHours: s.restaurantHours ?? undefined,
      restaurantInstagram: s.restaurantInstagram ?? undefined,
      restaurantWhatsapp: s.restaurantWhatsapp ?? undefined,
      restaurantTelegram: s.restaurantTelegram ?? undefined,
      restaurantGoogleMapsUrl: s.restaurantGoogleMapsUrl ?? undefined,
      loginBackgroundImage: s.loginBackgroundImage ?? undefined,
      qrShowLogo: s.qrShowLogo ?? true,
      qrShowTitle: s.qrShowTitle ?? true,
      qrShowDescription: s.qrShowDescription ?? true,
      qrShowAnimatedText: s.qrShowAnimatedText ?? true,
      qrAnimatedTexts: s.qrAnimatedTexts ?? ['Welcome', 'Discover our Menu'],
      qrMediaUrl: s.qrMediaUrl ?? undefined,
      qrMediaType: s.qrMediaType ?? undefined,
      qrTextColor: s.qrTextColor ?? '#000000',
      qrEyeBorderColor: s.qrEyeBorderColor ?? '#000000',
      qrEyeDotColor: s.qrEyeDotColor ?? '#000000',
      qrEyeBorderShape: s.qrEyeBorderShape ?? 'square',
      qrEyeDotShape: s.qrEyeDotShape ?? 'square',
      qrDotsStyle: s.qrDotsStyle ?? 'square',
      qrForegroundColor: s.qrForegroundColor ?? '#000000',
      qrBackgroundColor: s.qrBackgroundColor ?? '#FFFFFF',
      qrCenterType: s.qrCenterType ?? 'logo',
      qrCenterText: s.qrCenterText ?? undefined,
      qrPageTitle: s.qrPageTitle ?? 'Scan to Order',
      qrPageDescription: s.qrPageDescription ?? '',
      qrShowCallWaiter: s.qrShowCallWaiter ?? true,
      qrShowAddressPhone: s.qrShowAddressPhone ?? true,
      qrLogo: s.qrLogo ?? undefined,
      showMenuInstagram: s.showMenuInstagram ?? true,
      showMenuWhatsapp: s.showMenuWhatsapp ?? true,
      showMenuTelegram: s.showMenuTelegram ?? true,
      showMenuLanguageSelector: s.showMenuLanguageSelector ?? true,
      showMenuThemeSwitcher: s.showMenuThemeSwitcher ?? true,
      menuShowRestaurantLogo: s.menuShowRestaurantLogo ?? true,
      menuShowRestaurantName: s.menuShowRestaurantName ?? true,
      menuShowRestaurantDescription: s.menuShowRestaurantDescription ?? true,
      menuShowOperationHours: s.menuShowOperationHours ?? true,
      menuShowMenu: s.menuShowMenu ?? true,
      menuShowAllMenuItems: s.menuShowAllMenuItems ?? true,
      menuShowRecommendedMenuItems: s.menuShowRecommendedMenuItems ?? true,
      menuShowFoodType: s.menuShowFoodType ?? true,
      menuShowSearchBar: s.menuShowSearchBar ?? true,
      menuShowViewSwitcher: s.menuShowViewSwitcher ?? true,
      menuShowPrices: s.menuShowPrices ?? true,
      menuShowImages: s.menuShowImages ?? true,
      menuShowIngredients: s.menuShowIngredients ?? true,
      menuShowFoodTypes: s.menuShowFoodTypes ?? true,
      menuShowBuyButton: s.menuShowBuyButton ?? true,
      menuShowMoreInformationPopup: s.menuShowMoreInformationPopup ?? true,
      menuDefaultTheme: s.menuDefaultTheme ?? 'light',
      menuBackgroundType: s.menuBackgroundType ?? 'default',
      createdAt: s.createdAt ?? undefined,
    });
    return mapSettings(s);
  }

  async updateSettings(data: Partial<Omit<StorageSetting, "id" | "createdAt">>): Promise<StorageSetting> {
    const db = getDb();
    const existing = await this.getSettings();
    
    const mapSettings = (s: any): StorageSetting => ({
      ...s,
      favicon: s.favicon ?? undefined,
      licenseKey: s.licenseKey ?? undefined,
      licenseExpiryDate: s.licenseExpiryDate ?? undefined,
      restaurantLogo: s.restaurantLogo ?? undefined,
      restaurantBackgroundImage: s.restaurantBackgroundImage ?? undefined,
      restaurantHours: s.restaurantHours ?? undefined,
      restaurantInstagram: s.restaurantInstagram ?? undefined,
      restaurantWhatsapp: s.restaurantWhatsapp ?? undefined,
      restaurantTelegram: s.restaurantTelegram ?? undefined,
      restaurantGoogleMapsUrl: s.restaurantGoogleMapsUrl ?? undefined,
      loginBackgroundImage: s.loginBackgroundImage ?? undefined,
      qrShowLogo: s.qrShowLogo ?? true,
      qrShowTitle: s.qrShowTitle ?? true,
      qrShowDescription: s.qrShowDescription ?? true,
      qrShowAnimatedText: s.qrShowAnimatedText ?? true,
      qrAnimatedTexts: s.qrAnimatedTexts ?? ['Welcome', 'Discover our Menu'],
      qrMediaUrl: s.qrMediaUrl ?? undefined,
      qrMediaType: s.qrMediaType ?? undefined,
      qrTextColor: s.qrTextColor ?? '#000000',
      qrEyeBorderColor: s.qrEyeBorderColor ?? '#000000',
      qrEyeDotColor: s.qrEyeDotColor ?? '#000000',
      qrEyeBorderShape: s.qrEyeBorderShape ?? 'square',
      qrEyeDotShape: s.qrEyeDotShape ?? 'square',
      qrDotsStyle: s.qrDotsStyle ?? 'square',
      qrForegroundColor: s.qrForegroundColor ?? '#000000',
      qrBackgroundColor: s.qrBackgroundColor ?? '#FFFFFF',
      qrCenterType: s.qrCenterType ?? 'logo',
      qrCenterText: s.qrCenterText ?? undefined,
      qrPageTitle: s.qrPageTitle ?? 'Scan to Order',
      qrPageDescription: s.qrPageDescription ?? '',
      qrShowCallWaiter: s.qrShowCallWaiter ?? true,
      qrShowAddressPhone: s.qrShowAddressPhone ?? true,
      qrLogo: s.qrLogo ?? undefined,
      showMenuInstagram: s.showMenuInstagram ?? true,
      showMenuWhatsapp: s.showMenuWhatsapp ?? true,
      showMenuTelegram: s.showMenuTelegram ?? true,
      showMenuLanguageSelector: s.showMenuLanguageSelector ?? true,
      showMenuThemeSwitcher: s.showMenuThemeSwitcher ?? true,
      menuShowRestaurantLogo: s.menuShowRestaurantLogo ?? true,
      menuShowRestaurantName: s.menuShowRestaurantName ?? true,
      menuShowRestaurantDescription: s.menuShowRestaurantDescription ?? true,
      menuShowOperationHours: s.menuShowOperationHours ?? true,
      menuShowMenu: s.menuShowMenu ?? true,
      menuShowAllMenuItems: s.menuShowAllMenuItems ?? true,
      menuShowRecommendedMenuItems: s.menuShowRecommendedMenuItems ?? true,
      menuShowFoodType: s.menuShowFoodType ?? true,
      menuShowSearchBar: s.menuShowSearchBar ?? true,
      menuShowViewSwitcher: s.menuShowViewSwitcher ?? true,
      menuShowPrices: s.menuShowPrices ?? true,
      menuShowImages: s.menuShowImages ?? true,
      menuShowIngredients: s.menuShowIngredients ?? true,
      menuShowFoodTypes: s.menuShowFoodTypes ?? true,
      menuShowBuyButton: s.menuShowBuyButton ?? true,
      menuShowMoreInformationPopup: s.menuShowMoreInformationPopup ?? true,
      menuDefaultTheme: s.menuDefaultTheme ?? 'light',
      menuBackgroundType: s.menuBackgroundType ?? 'default',
      createdAt: s.createdAt ?? undefined,
    });

    if (!existing) {
      const result = await db.insert(settings).values(data as any).returning();
      return mapSettings(result[0]);
    }

    const result = await db.update(settings).set(data as any).where(eq(settings.id, existing.id)).returning();
    return mapSettings(result[0]);
  }

  async getUser(id: string): Promise<StorageUser | undefined> {
    const db = getDb();
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (user.length === 0) return undefined;
    return this.mapToStorageUser(user[0]);
  }

  async getUserByUsername(username: string): Promise<StorageUser | undefined> {
    const db = getDb();
    const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (user.length === 0) return undefined;
    return this.mapToStorageUser(user[0]);
  }

  async createUser(userData: Omit<StorageUser, "id">): Promise<StorageUser> {
    const db = getDb();
    const result = await db.insert(users).values(userData).returning();
    if (result.length === 0) throw new Error("Failed to create user");
    return this.mapToStorageUser(result[0]);
  }

  async updateUser(id: string, data: Partial<Omit<StorageUser, "id" | "username">>): Promise<StorageUser | undefined> {
    const db = getDb();
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    if (result.length === 0) return undefined;
    return this.mapToStorageUser(result[0]);
  }

  async getAllUsers(): Promise<StorageUser[]> {
    const db = getDb();
    const allUsers = await db.select().from(users);
    return allUsers.map(u => this.mapToStorageUser(u));
  }

  async deleteUser(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getBranch(id: string): Promise<StorageBranch | undefined> {
    const db = getDb();
    const result = await db.select().from(branches).where(eq(branches.id, id)).limit(1);
    if (result.length === 0) return undefined;
    const b = result[0];
    return {
      id: b.id,
      name: b.name,
      address: b.address,
      phone: b.phone,
      owner: b.owner ?? undefined,
      ownerPhone: b.ownerPhone ?? undefined,
      isActive: b.isActive,
    };
  }

  async getAllBranches(): Promise<StorageBranch[]> {
    const db = getDb();
    const results = await db.select().from(branches);
    return results.map((b) => ({
      id: b.id,
      name: b.name,
      address: b.address,
      phone: b.phone,
      owner: b.owner ?? undefined,
      ownerPhone: b.ownerPhone ?? undefined,
      isActive: b.isActive,
    }));
  }

  async createBranch(branch: Omit<StorageBranch, "id">): Promise<StorageBranch> {
    const db = getDb();
    const result = await db.insert(branches).values(branch).returning();
    if (result.length === 0) throw new Error("Failed to create branch");
    const b = result[0];
    return {
      id: b.id,
      name: b.name,
      address: b.address,
      phone: b.phone,
      owner: b.owner ?? undefined,
      ownerPhone: b.ownerPhone ?? undefined,
      isActive: b.isActive,
    };
  }

  async updateBranch(id: string, data: Partial<Omit<StorageBranch, "id">>): Promise<StorageBranch | undefined> {
    const db = getDb();
    const result = await db.update(branches).set(data).where(eq(branches.id, id)).returning();
    if (result.length === 0) return undefined;
    const b = result[0];
    return {
      id: b.id,
      name: b.name,
      address: b.address,
      phone: b.phone,
      owner: b.owner ?? undefined,
      ownerPhone: b.ownerPhone ?? undefined,
      isActive: b.isActive,
    };
  }

  async deleteBranch(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(branches).where(eq(branches.id, id)).returning();
    return result.length > 0;
  }

  async getCategory(id: string): Promise<StorageCategory | undefined> {
    const db = getDb();
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async getAllCategories(): Promise<StorageCategory[]> {
    const db = getDb();
    return (await db.select().from(categories)) as any;
  }

  async createCategory(category: Omit<StorageCategory, "id">): Promise<StorageCategory> {
    const db = getDb();
    const result = await db.insert(categories).values(category as any).returning();
    if (result.length === 0) throw new Error("Failed to create category");
    return result[0] as any;
  }

  async updateCategory(id: string, data: Partial<Omit<StorageCategory, "id">>): Promise<StorageCategory | undefined> {
    const db = getDb();
    const result = await db.update(categories).set(data as any).where(eq(categories.id, id)).returning();
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  async getItem(id: string): Promise<StorageItem | undefined> {
    const db = getDb();
    const result = await db.select().from(items).where(eq(items.id, id)).limit(1);
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async getAllItems(): Promise<StorageItem[]> {
    const db = getDb();
    return (await db.select().from(items)) as any;
  }

  async getItemsByCategory(categoryId: string): Promise<StorageItem[]> {
    const db = getDb();
    return (await db.select().from(items).where(eq(items.categoryId, categoryId))) as any;
  }

  async createItem(item: Omit<StorageItem, "id">): Promise<StorageItem> {
    const db = getDb();
    const result = await db.insert(items).values(item as any).returning();
    if (result.length === 0) throw new Error("Failed to create item");
    return result[0] as any;
  }

  async updateItem(id: string, data: Partial<Omit<StorageItem, "id">>): Promise<StorageItem | undefined> {
    const db = getDb();
    const result = await db.update(items).set(data as any).where(eq(items.id, id)).returning();
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async deleteItem(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(items).where(eq(items.id, id)).returning();
    return result.length > 0;
  }

  async getTable(id: string): Promise<StorageTable | undefined> {
    const db = getDb();
    const result = await db.select().from(tables).where(eq(tables.id, id)).limit(1);
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async getAllTables(): Promise<StorageTable[]> {
    const db = getDb();
    return (await db.select().from(tables)) as any;
  }

  async getTablesByBranch(branchId: string): Promise<StorageTable[]> {
    const db = getDb();
    return (await db.select().from(tables).where(eq(tables.branchId, branchId))) as any;
  }

  async createTable(table: Omit<StorageTable, 'id'>): Promise<StorageTable> {
    const db = getDb();
    const result = await db.insert(tables).values(table as any).returning();
    if (result.length === 0) throw new Error("Failed to create table");
    return result[0] as any;
  }

  async updateTable(id: string, data: Partial<Omit<StorageTable, 'id'>>): Promise<StorageTable | undefined> {
    const db = getDb();
    const result = await db.update(tables).set(data as any).where(eq(tables.id, id)).returning();
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async deleteTable(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(tables).where(eq(tables.id, id)).returning();
    return result.length > 0;
  }

  async getLanguage(id: string): Promise<StorageLanguage | undefined> {
    const db = getDb();
    const result = await db.select().from(languages).where(eq(languages.id, id)).limit(1);
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async getAllLanguages(): Promise<StorageLanguage[]> {
    const db = getDb();
    return (await db.select().from(languages)) as any;
  }

  async createLanguage(language: Omit<StorageLanguage, 'id'>): Promise<StorageLanguage> {
    const db = getDb();
    const result = await db.insert(languages).values(language as any).returning();
    if (result.length === 0) throw new Error("Failed to create language");
    return result[0] as any;
  }

  async updateLanguage(id: string, data: Partial<Omit<StorageLanguage, 'id'>>): Promise<StorageLanguage | undefined> {
    const db = getDb();
    const result = await db.update(languages).set(data as any).where(eq(languages.id, id)).returning();
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async deleteLanguage(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(languages).where(eq(languages.id, id)).returning();
    return result.length > 0;
  }

  async getFoodType(id: string): Promise<StorageFoodType | undefined> {
    const db = getDb();
    const result = await db.select().from(foodTypes).where(eq(foodTypes.id, id)).limit(1);
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async getAllFoodTypes(): Promise<StorageFoodType[]> {
    const db = getDb();
    return (await db.select().from(foodTypes)) as any;
  }

  async createFoodType(foodType: Omit<StorageFoodType, 'id'>): Promise<StorageFoodType> {
    const db = getDb();
    const result = await db.insert(foodTypes).values(foodType as any).returning();
    if (result.length === 0) throw new Error("Failed to create food type");
    return result[0] as any;
  }

  async updateFoodType(id: string, data: Partial<Omit<StorageFoodType, 'id'>>): Promise<StorageFoodType | undefined> {
    const db = getDb();
    const result = await db.update(foodTypes).set(data as any).where(eq(foodTypes.id, id)).returning();
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async deleteFoodType(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(foodTypes).where(eq(foodTypes.id, id)).returning();
    return result.length > 0;
  }

  async getMaterial(id: string): Promise<StorageMaterial | undefined> {
    const db = getDb();
    const result = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async getAllMaterials(): Promise<StorageMaterial[]> {
    const db = getDb();
    return (await db.select().from(materials)) as any;
  }

  async createMaterial(material: Omit<StorageMaterial, 'id'>): Promise<StorageMaterial> {
    const db = getDb();
    const result = await db.insert(materials).values(material as any).returning();
    if (result.length === 0) throw new Error("Failed to create material");
    return result[0] as any;
  }

  async updateMaterial(id: string, data: Partial<Omit<StorageMaterial, 'id'>>): Promise<StorageMaterial | undefined> {
    const db = getDb();
    const result = await db.update(materials).set(data as any).where(eq(materials.id, id)).returning();
    if (result.length === 0) return undefined;
    return result[0] as any;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(materials).where(eq(materials.id, id)).returning();
    return result.length > 0;
  }

  async getOrder(id: string): Promise<StorageOrder | undefined> {
    const db = getDb();
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (result.length === 0) return undefined;
    const order = result[0];
    return {
      ...order,
      tableNumber: order.tableNumber ?? undefined,
      notes: order.notes ?? undefined,
      createdAt: order.createdAt ?? new Date(),
      updatedAt: order.updatedAt ?? new Date(),
      items: order.items as any,
      totalAmount: parseFloat(order.totalAmount),
      status: order.status as "pending" | "preparing" | "ready" | "served" | "cancelled",
    };
  }

  async getAllOrders(): Promise<StorageOrder[]> {
    const db = getDb();
    const result = await db.select().from(orders);
    return result.map(order => ({
      ...order,
      tableNumber: order.tableNumber ?? undefined,
      notes: order.notes ?? undefined,
      createdAt: order.createdAt ?? new Date(),
      updatedAt: order.updatedAt ?? new Date(),
      items: order.items as any,
      totalAmount: parseFloat(order.totalAmount),
      status: order.status as "pending" | "preparing" | "ready" | "served" | "cancelled",
    }));
  }

  async getOrdersByBranch(branchId: string): Promise<StorageOrder[]> {
    const db = getDb();
    const result = await db.select().from(orders).where(eq(orders.branchId, branchId));
    return result.map(order => ({
      ...order,
      tableNumber: order.tableNumber ?? undefined,
      notes: order.notes ?? undefined,
      createdAt: order.createdAt ?? new Date(),
      updatedAt: order.updatedAt ?? new Date(),
      items: order.items as any,
      totalAmount: parseFloat(order.totalAmount),
      status: order.status as "pending" | "preparing" | "ready" | "served" | "cancelled",
    }));
  }

  async createOrder(order: Omit<StorageOrder, "id">): Promise<StorageOrder> {
    const db = getDb();
    const result = await db.insert(orders).values({
      ...order,
      totalAmount: order.totalAmount.toString(),
      items: order.items as any,
    }).returning();
    if (result.length === 0) throw new Error("Failed to create order");
    const newOrder = result[0];
    return {
      ...newOrder,
      tableNumber: newOrder.tableNumber ?? undefined,
      notes: newOrder.notes ?? undefined,
      createdAt: newOrder.createdAt ?? new Date(),
      updatedAt: newOrder.updatedAt ?? new Date(),
      items: newOrder.items as any,
      totalAmount: parseFloat(newOrder.totalAmount),
      status: newOrder.status as "pending" | "preparing" | "ready" | "served" | "cancelled",
    };
  }

  async updateOrder(id: string, data: Partial<Omit<StorageOrder, "id">>): Promise<StorageOrder | undefined> {
    const db = getDb();
    const updateData: any = { ...data };
    if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount.toString();
    if (data.items !== undefined) updateData.items = data.items as any;
    
    const result = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    if (result.length === 0) return undefined;
    const updatedOrder = result[0];
    return {
      ...updatedOrder,
      tableNumber: updatedOrder.tableNumber ?? undefined,
      notes: updatedOrder.notes ?? undefined,
      createdAt: updatedOrder.createdAt ?? new Date(),
      updatedAt: updatedOrder.updatedAt ?? new Date(),
      items: updatedOrder.items as any,
      totalAmount: parseFloat(updatedOrder.totalAmount),
      status: updatedOrder.status as "pending" | "preparing" | "ready" | "served" | "cancelled",
    };
  }

  async createWaiterRequest(data: { tableId?: string; branchId?: string }): Promise<WaiterRequest> {
    const db = getDb();
    const result = await db
      .insert(waiterRequests)
      .values({
        tableId: data.tableId,
        branchId: data.branchId,
        status: "pending",
        timestamp: new Date(),
      })
      .returning();
    if (result.length === 0) throw new Error("Failed to create waiter request");
    const row = result[0];
    return {
      id: row.id,
      tableId: row.tableId ?? undefined,
      branchId: row.branchId ?? undefined,
      timestamp: row.timestamp || new Date(),
      status: (row.status as 'pending' | 'acknowledged' | 'completed') || 'pending',
    };
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const db = getDb();
    
    const waiterRequestsData = await db.select().from(waiterRequests);
    
    return {
      totalItems: 9,
      totalCategories: 4,
      availableItems: 9,
      qrScans: 156,
      salesDay: 1250.50,
      salesWeek: 8750.25,
      salesMonth: 35420.80,
      customersDay: 45,
      customersWeek: 312,
      customersMonth: 1245,
      menuViewsDay: 234,
      menuViewsWeek: 1567,
      menuViewsMonth: 6234,
      bestSellers: [
        { itemId: "4", name: "Margherita Pizza", count: 89 },
        { itemId: "3", name: "Spaghetti Carbonara", count: 76 },
        { itemId: "1", name: "Bruschetta", count: 65 },
        { itemId: "5", name: "Grilled Salmon", count: 54 },
        { itemId: "6", name: "Tiramisu", count: 48 },
      ],
      salesChart: [
        { date: "Mon", amount: 1200 },
        { date: "Tue", amount: 1450 },
        { date: "Wed", amount: 1100 },
        { date: "Thu", amount: 1680 },
        { date: "Fri", amount: 2100 },
        { date: "Sat", amount: 2450 },
        { date: "Sun", amount: 1870 },
      ],
      viewsChart: [
        { date: "Mon", views: 180 },
        { date: "Tue", views: 220 },
        { date: "Wed", views: 195 },
        { date: "Thu", views: 240 },
        { date: "Fri", views: 310 },
        { date: "Sat", views: 380 },
        { date: "Sun", views: 290 },
      ],
    };
  }

  private mapToStorageUser(user: any): StorageUser {
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name || "",
      email: user.email || "",
      role: (user.role as "admin" | "manager" | "chef" | "accountant") || "chef",
      avatar: user.avatar || undefined,
      phone: user.phone || undefined,
      branchId: user.branchId || undefined,
      createdAt: user.createdAt || undefined,
      language: user.language || "en",
    };
  }
}

export const drizzleStorage = new DrizzleStorage();
