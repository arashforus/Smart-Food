import en from '../locales/en.json';
import tr from '../locales/tr.json';
import fa from '../locales/fa.json';
import ar from '../locales/ar.json';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  logo?: string;
  backgroundImage?: string;
  currency: string;
  currencySymbol: string;
  mapLat?: number;
  mapLng?: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  owner?: string;
  ownerPhone?: string;
  isActive: boolean;
}

export interface RestaurantTable {
  id: string;
  branchId: string;
  number: string;
  seats: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: Record<string, string>;
  image?: string;
  order: number;
}

export interface Material {
  id: string;
  name: Record<string, string>;
  icon?: string;
  image?: string;
  backgroundColor: string;
}

export interface FoodType {
  id: string;
  name: Record<string, string>;
  icon?: string;
  color: string;
}

export interface MenuItem {
  id: string;
  name: Record<string, string>;
  shortDescription: Record<string, string>;
  longDescription: Record<string, string>;
  price: number;
  discountedPrice?: number;
  maxSelect?: number;
  categoryId: string;
  image?: string;
  available: boolean;
  suggested: boolean;
  isNew: boolean;
  smokeEffect?: boolean;
  fireEffect?: boolean;
  iceEffect?: boolean;
  materials: string[];
  types: string[];
}

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: Record<string, string>;
  quantity: number;
  price: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready';
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  branchId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface AppLanguage {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flagImage?: string;
  isActive: boolean;
  isDefault: boolean;
  textOverrides?: Record<string, string>;
}

export type Role = 'admin' | 'manager' | 'chef' | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  branchId?: string;
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  createdAt?: string | Date;
}

export interface RolePermissions {
  admin: string[];
  manager: string[];
  chef: string[];
  accountant: string[];
}

export interface PaymentSettings {
  paymentMethod: 'cash' | 'card' | 'both';
  stripeEnabled?: boolean;
  paypalEnabled?: boolean;
  applePayEnabled?: boolean;
}

export interface Settings {
  id: string;
  primaryColor: string;
  favicon?: string;
  logoUrl?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  menuTitle: string;
  showPrices: boolean;
  showImages: boolean;
  showMaterials: boolean;
  showTypes: boolean;
  defaultLanguage: string;
  currency?: string;
  currencySymbol?: string;
  currencyPosition?: 'before' | 'after';
  currencyName?: string;
  currencySelect?: string;
  currencyDecimal?: number;
  licenseKey?: string;
  licenseExpiry?: string;
  paymentSettings?: PaymentSettings;
  rolePermissions?: RolePermissions;
  restaurantName?: string;
  restaurantDescription?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  restaurantHours?: string;
  restaurantLogo?: string;
  restaurantBackgroundImage?: string;
  restaurantMapLat?: number;
  restaurantMapLng?: number;
  restaurantInstagram?: string;
  restaurantWhatsapp?: string;
  restaurantTelegram?: string;
  restaurantGoogleMapsUrl?: string;
  loginBackgroundImage?: string;
  showLoginTitle?: boolean;
  loginTitle?: string;
  showLoginResetPassword?: boolean;
  qrShowLogo?: boolean;
  qrShowTitle?: boolean;
  qrPageTitle?: string;
  qrShowDescription?: boolean;
  qrPageDescription?: string;
  qrShowAnimatedText?: boolean;
  qrAnimatedTexts?: string[];
  qrMediaUrl?: string;
  qrMediaType?: string;
  qrTextColor?: string;
  qrCenterType?: 'none' | 'logo' | 'text';
  qrCenterText?: string;
  qrShowCallWaiter?: boolean;
  qrShowAddressPhone?: boolean;
  qrLogo?: string;
  qrEyeBorderColor?: string;
  qrEyeDotColor?: string;
  qrEyeBorderShape?: string;
  qrEyeDotShape?: string;
  qrDotsStyle?: string;
  qrForegroundColor?: string;
  qrBackgroundColor?: string;
  operatingHours?: string;
  showMenuInstagram?: boolean;
  showMenuWhatsapp?: boolean;
  showMenuTelegram?: boolean;
  showMenuLanguageSelector?: boolean;
  showMenuThemeSwitcher?: boolean;
  menuDefaultTheme?: string;
  menuBackgroundType?: string;
  menuBackgroundColor?: string;
  menuGradientStart?: string;
  menuGradientEnd?: string;
  menuBackgroundImage?: string;
  showRestaurantLogo?: boolean;
  showRestaurantName?: boolean;
  showRestaurantDescription?: boolean;
  showRestaurantHours?: boolean;
  menuShowRestaurantLogo?: boolean;
  menuShowRestaurantName?: boolean;
  menuShowRestaurantDescription?: boolean;
  menuShowOperationHours?: boolean;
  showMenu?: boolean;
  menuShowMenu?: boolean;
  showAllMenuItem?: boolean;
  menuShowAllMenuItems?: boolean;
  showRecommendedMenuItem?: boolean;
  menuShowRecommendedMenuItems?: boolean;
  showFoodType?: boolean;
  menuShowFoodType?: boolean;
  showSearchBar?: boolean;
  menuShowSearchBar?: boolean;
  showViewSwitcher?: boolean;
  menuShowViewSwitcher?: boolean;
  menuShowPrices?: boolean;
  menuShowImages?: boolean;
  menuShowIngredients?: boolean;
  menuShowFoodTypes?: boolean;
  showBuyButton?: boolean;
  menuShowBuyButton?: boolean;
  showMoreInformationPopup?: boolean;
  menuShowMoreInformationPopup?: boolean;
  menuLogoShowBackground?: boolean;
  menuLogoBackgroundType?: 'square' | 'square-low' | 'square-high' | 'circle';
  menuLogoBackgroundColorLight?: string;
  menuLogoBackgroundColorDark?: string;
  kdShowTableNumber?: boolean;
  kdShowOrderTime?: boolean;
  kdShowClock?: boolean;
  kdShowNotes?: boolean;
  kdHasPendingStatus?: boolean;
  kdShowRecentlyCompleted?: boolean;
  kdPendingColor?: string;
  kdPreparingColor?: string;
  kdReadyColor?: string;
  timezone?: string;
  licenseOwner?: string;
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

export interface WaiterRequest {
  id: string;
  tableId?: string;
  branchId?: string;
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'completed';
}

export type Language = string;

export const roleLabels: Record<Role, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  chef: 'Chef',
  accountant: 'Accountant',
};

export const rolePermissions: Record<Role, string[]> = {
  admin: ['all'],
  manager: ['dashboard', 'restaurant', 'categories', 'items', 'tables', 'qrcode', 'materials', 'types'],
  chef: ['dashboard', 'categories', 'items', 'materials'],
  accountant: ['dashboard', 'restaurant'],
};

export const translations: Record<string, any> = {
  en,
  tr,
  fa,
  ar,
};
