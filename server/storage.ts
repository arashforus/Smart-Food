import { randomUUID } from "crypto";

export interface StorageUser {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'chef' | 'accountant';
  avatar?: string;
  phone?: string;
  branchId?: string;
  createdAt?: Date;
  language?: string;
}

export interface StorageBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  owner?: string;
  ownerPhone?: string;
  isActive: boolean;
}

export interface StorageCategory {
  id: string;
  generalName: string;
  name: Record<string, string>;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface StorageItem {
  id: string;
  categoryId: string;
  name: Record<string, string>;
  shortDescription: Record<string, string>;
  longDescription: Record<string, string>;
  price: number;
  discountedPrice?: number;
  maxSelect?: number;
  image?: string;
  available: boolean;
  suggested: boolean;
  isNew: boolean;
  materials?: string[];
  types?: string[];
}

export interface StorageOrderItem {
  id: string;
  menuItemId: string;
  menuItemName: Record<string, string>;
  quantity: number;
  price: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready';
}

export interface StorageOrder {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  branchId: string;
  items: StorageOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaiterRequest {
  id: string;
  tableId?: string;
  branchId?: string;
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'completed';
}

export interface StorageTable {
  id: string;
  tableNumber: string;
  branchId: string;
  capacity: number;
  location?: string;
  status: string;
  isActive: boolean;
}

export interface StorageLanguage {
  id: string;
  code: string;
  name: string;
  nativeName?: string;
  direction?: string;
  flagImage?: string;
  isActive: boolean;
  isDefault?: boolean;
  order: number;
}

export interface StorageFoodType {
  id: string;
  generalName: string;
  name: Record<string, string>;
  description: Record<string, string>;
  icon?: string;
  color?: string;
  isActive: boolean;
  order: number;
}

export interface StorageMaterial {
  id: string;
  generalName: string;
  name: Record<string, string>;
  icon?: string;
  color?: string;
  isActive: boolean;
  order: number;
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

import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session as any);

export interface StorageSetting {
  id: string;
  primaryColor: string;
  timezone: string;
  favicon?: string;
  currencyName: string;
  currencySymbol: string;
  licenseKey?: string;
  licenseExpiryDate?: Date;
  licenseOwner?: string;
  defaultLanguage: string;
  restaurantName?: string;
  restaurantDescription?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  restaurantHours?: any;
  restaurantLogo?: string;
  restaurantBackgroundImage?: string;
  restaurantMapLat?: number;
  restaurantMapLng?: number;
  restaurantInstagram?: string;
  restaurantWhatsapp?: string;
  restaurantTelegram?: string;
  restaurantGoogleMapsUrl?: string;
  loginBackgroundImage?: string;
  loginTitle?: string;
  showLoginTitle?: boolean;
  showLoginResetPassword?: boolean;
  qrShowLogo?: boolean;
  qrShowTitle?: boolean;
  qrShowDescription?: boolean;
  qrShowAnimatedText?: boolean;
  qrAnimatedTexts?: string[];
  qrMediaUrl?: string;
  qrMediaType?: string;
  qrTextColor?: string;
  qrEyeBorderColor?: string;
  qrEyeDotColor?: string;
  qrEyeBorderShape?: string;
  qrEyeDotShape?: string;
  qrDotsStyle?: string;
  qrForegroundColor?: string;
  qrBackgroundColor?: string;
  qrCenterType?: string;
  qrCenterText?: string;
  qrPageTitle?: string;
  qrPageDescription?: string;
  qrShowCallWaiter?: boolean;
  qrShowAddressPhone?: boolean;
  showMenuInstagram?: boolean;
  showMenuWhatsapp?: boolean;
  showMenuTelegram?: boolean;
  showMenuLanguageSelector?: boolean;
  showMenuThemeSwitcher?: boolean;
  menuShowRestaurantLogo?: boolean;
  menuShowRestaurantName?: boolean;
  menuShowRestaurantDescription?: boolean;
  menuShowOperationHours?: boolean;
  menuShowMenu?: boolean;
  menuShowAllMenuItems?: boolean;
  menuShowRecommendedMenuItems?: boolean;
  menuShowFoodType?: boolean;
  menuShowSearchBar?: boolean;
  menuShowViewSwitcher?: boolean;
  menuShowPrices?: boolean;
  menuShowImages?: boolean;
  menuShowIngredients?: boolean;
  menuShowFoodTypes?: boolean;
  menuShowBuyButton?: boolean;
  menuShowMoreInformationPopup?: boolean;
  menuDefaultTheme?: string;
  menuBackgroundType?: string;
  menuBackgroundColor?: string;
  menuGradientStart?: string;
  menuGradientEnd?: string;
  menuBackgroundImage?: string;
  paymentMethod?: string;
  rolesAdminPermissions?: string;
  rolesAdminSettingAccess?: string;
  rolesManagerPermissions?: string;
  rolesManagerSettingAccess?: string;
  rolesChefPermissions?: string;
  rolesChefSettingAccess?: string;
  rolesAccountantPermissions?: string;
  rolesAccountantSettingAccess?: string;
  ossPendingColor?: string;
  ossPreparingColor?: string;
  ossReadyColor?: string;
  ossBackgroundType?: string;
  ossBackgroundColor?: string;
  ossBackgroundImage?: string;
  ossCardTextColor?: string;
  ossCardBorderColor?: string;
  ossCardBoxStyle?: string;
  ossHeaderText?: string;
  ossNumberLabel?: string;
  ossTableLabel?: string;
  ossShowTableInformation?: boolean;
  ossShowStatusIcon?: boolean;
  createdAt?: Date;
}

export interface IStorage {
  sessionStore: session.Store;
  // Settings
  getSettings(): Promise<StorageSetting | undefined>;
  updateSettings(data: Partial<Omit<StorageSetting, 'id' | 'createdAt'>>): Promise<StorageSetting>;
  resetSettings(): Promise<StorageSetting>;
  
  getUser(id: string): Promise<StorageUser | undefined>;
  getUserByUsername(username: string): Promise<StorageUser | undefined>;
  createUser(user: Omit<StorageUser, 'id'>): Promise<StorageUser>;
  updateUser(id: string, data: Partial<Omit<StorageUser, 'id' | 'username'>>): Promise<StorageUser | undefined>;
  getAllUsers(): Promise<StorageUser[]>;
  deleteUser(id: string): Promise<boolean>;
  getBranch(id: string): Promise<StorageBranch | undefined>;
  getAllBranches(): Promise<StorageBranch[]>;
  createBranch(branch: Omit<StorageBranch, 'id'>): Promise<StorageBranch>;
  updateBranch(id: string, data: Partial<Omit<StorageBranch, 'id'>>): Promise<StorageBranch | undefined>;
  deleteBranch(id: string): Promise<boolean>;
  getCategory(id: string): Promise<StorageCategory | undefined>;
  getAllCategories(): Promise<StorageCategory[]>;
  createCategory(data: Omit<StorageCategory, 'id'>): Promise<StorageCategory>;
  updateCategory(id: string, data: Partial<Omit<StorageCategory, 'id'>>): Promise<StorageCategory | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  getItem(id: string): Promise<StorageItem | undefined>;
  getAllItems(): Promise<StorageItem[]>;
  getItemsByCategory(categoryId: string): Promise<StorageItem[]>;
  createItem(data: Omit<StorageItem, 'id'>): Promise<StorageItem>;
  updateItem(id: string, data: Partial<Omit<StorageItem, 'id'>>): Promise<StorageItem | undefined>;
  deleteItem(id: string): Promise<boolean>;
  getOrder(id: string): Promise<StorageOrder | undefined>;
  getAllOrders(): Promise<StorageOrder[]>;
  getOrdersByBranch(branchId: string): Promise<StorageOrder[]>;
  createOrder(data: Omit<StorageOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<StorageOrder>;
  updateOrder(id: string, data: Partial<Omit<StorageOrder, 'id' | 'createdAt' | 'updatedAt'>>): Promise<StorageOrder | undefined>;
  getTable(id: string): Promise<StorageTable | undefined>;
  getAllTables(): Promise<StorageTable[]>;
  getTablesByBranch(branchId: string): Promise<StorageTable[]>;
  createTable(data: Omit<StorageTable, 'id'>): Promise<StorageTable>;
  updateTable(id: string, data: Partial<Omit<StorageTable, 'id'>>): Promise<StorageTable | undefined>;
  deleteTable(id: string): Promise<boolean>;
  getLanguage(id: string): Promise<StorageLanguage | undefined>;
  getAllLanguages(): Promise<StorageLanguage[]>;
  createLanguage(data: Omit<StorageLanguage, 'id'>): Promise<StorageLanguage>;
  updateLanguage(id: string, data: Partial<Omit<StorageLanguage, 'id'>>): Promise<StorageLanguage | undefined>;
  deleteLanguage(id: string): Promise<boolean>;
  getFoodType(id: string): Promise<StorageFoodType | undefined>;
  getAllFoodTypes(): Promise<StorageFoodType[]>;
  createFoodType(data: Omit<StorageFoodType, 'id'>): Promise<StorageFoodType>;
  updateFoodType(id: string, data: Partial<Omit<StorageFoodType, 'id'>>): Promise<StorageFoodType | undefined>;
  deleteFoodType(id: string): Promise<boolean>;
  getMaterial(id: string): Promise<StorageMaterial | undefined>;
  getAllMaterials(): Promise<StorageMaterial[]>;
  createMaterial(data: Omit<StorageMaterial, 'id'>): Promise<StorageMaterial>;
  updateMaterial(id: string, data: Partial<Omit<StorageMaterial, 'id'>>): Promise<StorageMaterial | undefined>;
  deleteMaterial(id: string): Promise<boolean>;
  createWaiterRequest(data: { tableId?: string; branchId?: string }): Promise<WaiterRequest>;
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, StorageUser>;
  private settings: StorageSetting | undefined;
  private branches: Map<string, StorageBranch>;
  private categories: Map<string, StorageCategory>;
  private items: Map<string, StorageItem>;
  private orders: Map<string, StorageOrder>;
  private waiterRequests: Map<string, WaiterRequest>;
  private tables: Map<string, StorageTable>;
  private languages: Map<string, StorageLanguage>;
  private foodTypes: Map<string, StorageFoodType>;
  private materials: Map<string, StorageMaterial>;

  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new (SessionStore as any)({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    this.users = new Map();
    this.branches = new Map();
    this.categories = new Map();
    this.items = new Map();
    this.orders = new Map();
    this.waiterRequests = new Map();
    this.tables = new Map();
    this.languages = new Map();
    this.foodTypes = new Map();
    this.materials = new Map();
    
    const branch1: StorageBranch = { id: '1', name: 'Downtown Branch', address: '123 Main Street', phone: '+1 (555) 123-4567', isActive: true };
    const branch2: StorageBranch = { id: '2', name: 'Uptown Branch', address: '456 Oak Avenue', phone: '+1 (555) 234-5678', isActive: true };
    this.branches.set(branch1.id, branch1);
    this.branches.set(branch2.id, branch2);
    
    const adminUser: StorageUser = {
      id: randomUUID(),
      username: 'admin',
      password: 'admin123',
      name: 'John Admin',
      email: 'admin@restaurant.com',
      role: 'admin',
    };
    this.users.set(adminUser.id, adminUser);

    this.settings = {
      id: '1',
      primaryColor: '#4CAF50',
      timezone: 'UTC',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      defaultLanguage: 'en',
      qrShowLogo: true,
      qrShowAnimatedText: true,
      qrAnimatedTexts: ['Welcome', 'Discover our Menu'],
    };
  }

  async getSettings(): Promise<StorageSetting | undefined> {
    return this.settings;
  }

  async updateSettings(data: Partial<Omit<StorageSetting, 'id' | 'createdAt'>>): Promise<StorageSetting> {
    if (!this.settings) {
      this.settings = {
        id: '1',
        primaryColor: '#4CAF50',
        timezone: 'UTC',
        currencyName: 'US Dollar',
        currencySymbol: '$',
        defaultLanguage: 'en',
        ...data,
      };
    } else {
      this.settings = { ...this.settings, ...data };
    }
    return this.settings;
  }

  async resetSettings(): Promise<StorageSetting> {
    this.settings = {
      id: '1',
      primaryColor: '#4CAF50',
      timezone: 'UTC',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      defaultLanguage: 'en',
      qrShowLogo: true,
      qrShowTitle: true,
      qrShowDescription: true,
      qrShowAnimatedText: true,
      qrAnimatedTexts: ['Welcome', 'Hoş geldiniz', 'خوش آمدید', 'أهلاً وسهلاً'],
      qrShowCallWaiter: true,
      qrShowAddressPhone: true,
      qrPageTitle: 'Welcome',
      qrPageDescription: 'Please select your language to continue view the menu',
      qrTextColor: '#000000',
    };
    return this.settings;
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

  async updateUser(id: string, data: Partial<Omit<StorageUser, 'id' | 'username'>>): Promise<StorageUser | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<StorageUser[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getBranch(id: string): Promise<StorageBranch | undefined> {
    return this.branches.get(id);
  }

  async getAllBranches(): Promise<StorageBranch[]> {
    return Array.from(this.branches.values());
  }

  async createBranch(branch: Omit<StorageBranch, 'id'>): Promise<StorageBranch> {
    const id = randomUUID();
    const newBranch: StorageBranch = { ...branch, id };
    this.branches.set(id, newBranch);
    return newBranch;
  }

  async updateBranch(id: string, data: Partial<Omit<StorageBranch, 'id'>>): Promise<StorageBranch | undefined> {
    const branch = this.branches.get(id);
    if (!branch) return undefined;
    const updated = { ...branch, ...data };
    this.branches.set(id, updated);
    return updated;
  }

  async deleteBranch(id: string): Promise<boolean> {
    return this.branches.delete(id);
  }

  async getCategory(id: string): Promise<StorageCategory | undefined> {
    return this.categories.get(id);
  }

  async getAllCategories(): Promise<StorageCategory[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(data: Omit<StorageCategory, 'id'>): Promise<StorageCategory> {
    const id = randomUUID();
    const category: StorageCategory = { ...data, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, data: Partial<Omit<StorageCategory, 'id'>>): Promise<StorageCategory | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    const updated = { ...category, ...data };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getItem(id: string): Promise<StorageItem | undefined> {
    return this.items.get(id);
  }

  async getAllItems(): Promise<StorageItem[]> {
    return Array.from(this.items.values());
  }

  async getItemsByCategory(categoryId: string): Promise<StorageItem[]> {
    return Array.from(this.items.values()).filter(item => item.categoryId === categoryId);
  }

  async createItem(data: Omit<StorageItem, 'id'>): Promise<StorageItem> {
    const id = randomUUID();
    const item: StorageItem = { ...data, id };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: string, data: Partial<Omit<StorageItem, 'id'>>): Promise<StorageItem | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...data };
    this.items.set(id, updated);
    return updated;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async getOrder(id: string): Promise<StorageOrder | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<StorageOrder[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByBranch(branchId: string): Promise<StorageOrder[]> {
    return Array.from(this.orders.values()).filter(order => order.branchId === branchId);
  }

  async createOrder(data: Omit<StorageOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<StorageOrder> {
    const id = randomUUID();
    const now = new Date();
    const order: StorageOrder = { ...data, id, createdAt: now, updatedAt: now };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, data: Partial<Omit<StorageOrder, 'id' | 'createdAt' | 'updatedAt'>>): Promise<StorageOrder | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, ...data, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  async getTable(id: string): Promise<StorageTable | undefined> {
    return this.tables.get(id);
  }

  async getAllTables(): Promise<StorageTable[]> {
    return Array.from(this.tables.values());
  }

  async getTablesByBranch(branchId: string): Promise<StorageTable[]> {
    return Array.from(this.tables.values()).filter(t => t.branchId === branchId);
  }

  async createTable(data: Omit<StorageTable, 'id'>): Promise<StorageTable> {
    const id = randomUUID();
    const table: StorageTable = { ...data, id };
    this.tables.set(id, table);
    return table;
  }

  async updateTable(id: string, data: Partial<Omit<StorageTable, 'id'>>): Promise<StorageTable | undefined> {
    const table = this.tables.get(id);
    if (!table) return undefined;
    const updated = { ...table, ...data };
    this.tables.set(id, updated);
    return updated;
  }

  async deleteTable(id: string): Promise<boolean> {
    return this.tables.delete(id);
  }

  async getLanguage(id: string): Promise<StorageLanguage | undefined> {
    return this.languages.get(id);
  }

  async getAllLanguages(): Promise<StorageLanguage[]> {
    return Array.from(this.languages.values());
  }

  async createLanguage(data: Omit<StorageLanguage, 'id'>): Promise<StorageLanguage> {
    const id = randomUUID();
    const language: StorageLanguage = { ...data, id };
    this.languages.set(id, language);
    return language;
  }

  async updateLanguage(id: string, data: Partial<Omit<StorageLanguage, 'id'>>): Promise<StorageLanguage | undefined> {
    const language = this.languages.get(id);
    if (!language) return undefined;
    const updated = { ...language, ...data };
    this.languages.set(id, updated);
    return updated;
  }

  async deleteLanguage(id: string): Promise<boolean> {
    return this.languages.delete(id);
  }

  async getFoodType(id: string): Promise<StorageFoodType | undefined> {
    return this.foodTypes.get(id);
  }

  async getAllFoodTypes(): Promise<StorageFoodType[]> {
    return Array.from(this.foodTypes.values());
  }

  async createFoodType(data: Omit<StorageFoodType, 'id'>): Promise<StorageFoodType> {
    const id = randomUUID();
    const foodType: StorageFoodType = { ...data, id };
    this.foodTypes.set(id, foodType);
    return foodType;
  }

  async updateFoodType(id: string, data: Partial<Omit<StorageFoodType, 'id'>>): Promise<StorageFoodType | undefined> {
    const foodType = this.foodTypes.get(id);
    if (!foodType) return undefined;
    const updated = { ...foodType, ...data };
    this.foodTypes.set(id, updated);
    return updated;
  }

  async deleteFoodType(id: string): Promise<boolean> {
    return this.foodTypes.delete(id);
  }

  async getMaterial(id: string): Promise<StorageMaterial | undefined> {
    return this.materials.get(id);
  }

  async getAllMaterials(): Promise<StorageMaterial[]> {
    return Array.from(this.materials.values());
  }

  async createMaterial(data: Omit<StorageMaterial, 'id'>): Promise<StorageMaterial> {
    const id = randomUUID();
    const material: StorageMaterial = { ...data, id };
    this.materials.set(id, material);
    return material;
  }

  async updateMaterial(id: string, data: Partial<Omit<StorageMaterial, 'id'>>): Promise<StorageMaterial | undefined> {
    const material = this.materials.get(id);
    if (!material) return undefined;
    const updated = { ...material, ...data };
    this.materials.set(id, updated);
    return updated;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    return this.materials.delete(id);
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

// Use DrizzleStorage in production (when DATABASE_URL is set)
// Use MemStorage as fallback for development
export let storage: IStorage;

async function initializeStorage() {
  if (process.env.DATABASE_URL) {
    try {
      const { drizzleStorage } = await import("./drizzle-storage");
      storage = drizzleStorage;
    } catch (error) {
      console.warn("Failed to initialize DrizzleStorage, falling back to MemStorage", error);
      storage = new MemStorage();
    }
  } else {
    storage = new MemStorage();
  }
}

// Call it immediately but export the promise if needed, 
// or ensure it finishes before routes use it.
// For simplicity in this env, we call it top-level.
const initPromise = initializeStorage();
export { initPromise };
