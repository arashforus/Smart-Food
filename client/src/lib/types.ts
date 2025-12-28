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

export type Language = 'en' | 'tr' | 'fa' | 'ar';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    menu: 'Menu',
    categories: 'Categories',
    all: 'All',
    hours: 'Hours',
    address: 'Address',
    phone: 'Phone',
    aboutUs: 'About Us',
    selectLanguage: 'Select Language',
    english: 'English',
    spanish: 'Arabic',
    french: 'Arabic',
    persian: 'Persian',
    turkish: 'Turkish',
    hello: 'Hello',
    profile: 'Profile',
    changePassword: 'Change Password',
    signOut: 'Sign Out',
    settings: 'Settings',
    branches: 'Branches',
    tables: 'Tables',
    roles: 'Roles & Users',
    languages: 'Languages',
    materials: 'Materials',
    types: 'Food Types',
    dashboard: 'Dashboard',
    restaurant: 'Restaurant Info',
    menuItems: 'Menu Items',
    qrCode: 'QR Codes',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    callWaiter: 'Call Waiter',
    welcome: 'Welcome',
    chooseLanguage: 'Choose Your Language',
    viewMenu: 'View Menu',
    suggested: 'Chef\'s Recommendations',
    addToCart: 'Add to Cart',
    quantity: 'Quantity',
    cart: 'Cart',
    notes: 'Special Requests',
    notesPlaceholder: 'Add any special requests or notes...',
    total: 'Total',
    placeOrder: 'Place Order',
    continueMenu: 'Continue Shopping',
    emptyCart: 'Your cart is empty',
  },
  ar: {
    menu: 'القائمة',
    categories: 'الفئات',
    all: 'الكل',
    hours: 'ساعات العمل',
    address: 'العنوان',
    phone: 'الهاتف',
    aboutUs: 'من نحن',
    selectLanguage: 'اختر اللغة',
    english: 'الإنجليزية',
    spanish: 'الإسبانية',
    french: 'الفرنسية',
    persian: 'الفارسية',
    turkish: 'التركية',
    hello: 'مرحبا',
    profile: 'الملف الشخصي',
    changePassword: 'تغيير كلمة المرور',
    signOut: 'تسجيل الخروج',
    settings: 'الإعدادات',
    branches: 'الفروع',
    tables: 'الطاولات',
    roles: 'الأدوار والمستخدمين',
    languages: 'اللغات',
    materials: 'المواد',
    types: 'أنواع الطعام',
    dashboard: 'لوحة التحكم',
    restaurant: 'معلومات المطعم',
    menuItems: 'عناصر القائمة',
    qrCode: 'رموز QR',
    login: 'تسجيل الدخول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    callWaiter: 'استدعاء الخادم',
    welcome: 'أهلا وسهلا',
    chooseLanguage: 'اختر لغتك',
    viewMenu: 'عرض القائمة',
    suggested: 'توصيات الشيف',
    addToCart: 'أضف إلى العربة',
    quantity: 'الكمية',
    cart: 'العربة',
    notes: 'طلبات خاصة',
    notesPlaceholder: 'أضف طلبات خاصة أو ملاحظات...',
    total: 'المجموع',
    placeOrder: 'تقديم الطلب',
    continueMenu: 'متابعة التسوق',
    emptyCart: 'العربة الخاصة بك فارغة',
  },
  fa: {
    menu: 'منو',
    categories: 'دسته‌بندی‌ها',
    all: 'همه',
    hours: 'ساعات کاری',
    address: 'آدرس',
    phone: 'تلفن',
    aboutUs: 'درباره ما',
    selectLanguage: 'انتخاب زبان',
    english: 'انگلیسی',
    spanish: 'عربی',
    french: 'عربی',
    persian: 'فارسی',
    turkish: 'ترکی',
    hello: 'سلام',
    profile: 'پروفایل',
    changePassword: 'تغییر رمز عبور',
    signOut: 'خروج',
    settings: 'تنظیمات',
    branches: 'شعب',
    tables: 'میزها',
    roles: 'نقش‌ها و کاربران',
    languages: 'زبان‌ها',
    materials: 'مواد اولیه',
    types: 'انواع غذا',
    dashboard: 'داشبورد',
    restaurant: 'اطلاعات رستوران',
    menuItems: 'آیتم‌های منو',
    qrCode: 'کدهای QR',
    login: 'ورود',
    username: 'نام کاربری',
    password: 'رمز عبور',
    forgotPassword: 'رمز عبور را فراموش کرده‌اید؟',
    callWaiter: 'صدا زدن گارسون',
    welcome: 'خوش آمدید',
    chooseLanguage: 'زبان خود را انتخاب کنید',
    viewMenu: 'مشاهده منو',
    suggested: 'پیشنهادات سرآشپز',
    addToCart: 'افزودن به سبد',
    quantity: 'تعداد',
    cart: 'سبد خریدی',
    notes: 'درخواست‌های خاص',
    notesPlaceholder: 'درخواست‌های خاص یا یادداشت‌ها را اضافه کنید...',
    total: 'مجموع',
    placeOrder: 'ثبت سفارش',
    continueMenu: 'ادامه خرید',
    emptyCart: 'سبد خریدی شما خالی است',
  },
  tr: {
    menu: 'Menü',
    categories: 'Kategoriler',
    all: 'Tümü',
    hours: 'Çalışma Saatleri',
    address: 'Adres',
    phone: 'Telefon',
    aboutUs: 'Hakkımızda',
    selectLanguage: 'Dil Seçin',
    english: 'İngilizce',
    spanish: 'Arapça',
    french: 'Arapça',
    persian: 'Farsça',
    turkish: 'Türkçe',
    hello: 'Merhaba',
    profile: 'Profil',
    changePassword: 'Şifre Değiştir',
    signOut: 'Çıkış Yap',
    settings: 'Ayarlar',
    branches: 'Şubeler',
    tables: 'Masalar',
    roles: 'Roller ve Kullanıcılar',
    languages: 'Diller',
    materials: 'Malzemeler',
    types: 'Yemek Türleri',
    dashboard: 'Kontrol Paneli',
    restaurant: 'Restoran Bilgisi',
    menuItems: 'Menü Öğeleri',
    qrCode: 'QR Kodları',
    login: 'Giriş Yap',
    username: 'Kullanıcı Adı',
    password: 'Şifre',
    forgotPassword: 'Şifremi Unuttum?',
    callWaiter: 'Garson Çağır',
    welcome: 'Hoş Geldiniz',
    chooseLanguage: 'Dilinizi Seçin',
    viewMenu: 'Menüyü Görüntüle',
    suggested: 'Şefin Tavsiyeleri',
    addToCart: 'Sepete Ekle',
    quantity: 'Miktar',
    cart: 'Sepet',
    notes: 'Özel İstekler',
    notesPlaceholder: 'Özel istekler veya notlar ekleyin...',
    total: 'Toplam',
    placeOrder: 'Sipariş Ver',
    continueMenu: 'Alışverişe Devam Et',
    emptyCart: 'Sepetiniz boş',
  },
};

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
