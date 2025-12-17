import { randomUUID } from "crypto";

export interface StorageUser {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'chef' | 'accountant';
}

export interface WaiterRequest {
  id: string;
  tableId?: string;
  branchId?: string;
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'completed';
}

export interface DashboardMetrics {
  totalItems: number;
  totalCategories: number;
  availableItems: number;
  qrScans: number;
  salesDay: number;
  salesWeek: number;
  salesMonth: number;
  customersDay: number;
  customersWeek: number;
  customersMonth: number;
  menuViewsDay: number;
  menuViewsWeek: number;
  menuViewsMonth: number;
  bestSellers: { itemId: string; name: string; count: number }[];
  salesChart: { date: string; amount: number }[];
  viewsChart: { date: string; views: number }[];
}

export interface IStorage {
  getUser(id: string): Promise<StorageUser | undefined>;
  getUserByUsername(username: string): Promise<StorageUser | undefined>;
  createUser(user: Omit<StorageUser, 'id'>): Promise<StorageUser>;
  createWaiterRequest(data: { tableId?: string; branchId?: string }): Promise<WaiterRequest>;
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, StorageUser>;
  private waiterRequests: Map<string, WaiterRequest>;

  constructor() {
    this.users = new Map();
    this.waiterRequests = new Map();
    
    const adminUser: StorageUser = {
      id: randomUUID(),
      username: 'admin',
      password: 'admin123',
      name: 'John Admin',
      email: 'admin@restaurant.com',
      role: 'admin',
    };
    this.users.set(adminUser.id, adminUser);
  }

  async getUser(id: string): Promise<StorageUser | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<StorageUser | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: Omit<StorageUser, 'id'>): Promise<StorageUser> {
    const id = randomUUID();
    const user: StorageUser = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  async createWaiterRequest(data: { tableId?: string; branchId?: string }): Promise<WaiterRequest> {
    const id = randomUUID();
    const request: WaiterRequest = {
      id,
      tableId: data.tableId,
      branchId: data.branchId,
      timestamp: new Date(),
      status: 'pending',
    };
    this.waiterRequests.set(id, request);
    return request;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
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
        { itemId: '4', name: 'Margherita Pizza', count: 89 },
        { itemId: '3', name: 'Spaghetti Carbonara', count: 76 },
        { itemId: '1', name: 'Bruschetta', count: 65 },
        { itemId: '5', name: 'Grilled Salmon', count: 54 },
        { itemId: '6', name: 'Tiramisu', count: 48 },
      ],
      salesChart: [
        { date: 'Mon', amount: 1200 },
        { date: 'Tue', amount: 1450 },
        { date: 'Wed', amount: 1100 },
        { date: 'Thu', amount: 1680 },
        { date: 'Fri', amount: 2100 },
        { date: 'Sat', amount: 2450 },
        { date: 'Sun', amount: 1870 },
      ],
      viewsChart: [
        { date: 'Mon', views: 180 },
        { date: 'Tue', views: 220 },
        { date: 'Wed', views: 195 },
        { date: 'Thu', views: 240 },
        { date: 'Fri', views: 310 },
        { date: 'Sat', views: 380 },
        { date: 'Sun', views: 290 },
      ],
    };
  }
}

export const storage = new MemStorage();
