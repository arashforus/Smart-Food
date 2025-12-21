import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, waiterRequests } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import type { StorageUser, WaiterRequest, IStorage, DashboardMetrics } from "./storage";

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

export class DrizzleStorage implements IStorage {
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
    };
  }
}

export const drizzleStorage = new DrizzleStorage();
