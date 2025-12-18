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
  materials: string[];
  types: string[];
}

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
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

export type Language = 'en' | 'es' | 'fr' | 'fa' | 'tr';

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
    spanish: 'Spanish',
    french: 'French',
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
  es: {
    menu: 'Menú',
    categories: 'Categorías',
    all: 'Todos',
    hours: 'Horario',
    address: 'Dirección',
    phone: 'Teléfono',
    aboutUs: 'Sobre Nosotros',
    selectLanguage: 'Seleccionar Idioma',
    english: 'Inglés',
    spanish: 'Español',
    french: 'Francés',
    persian: 'Persa',
    turkish: 'Turco',
    hello: 'Hola',
    profile: 'Perfil',
    changePassword: 'Cambiar Contraseña',
    signOut: 'Cerrar Sesión',
    settings: 'Configuración',
    branches: 'Sucursales',
    tables: 'Mesas',
    roles: 'Roles y Usuarios',
    languages: 'Idiomas',
    materials: 'Materiales',
    types: 'Tipos de Comida',
    dashboard: 'Panel',
    restaurant: 'Info del Restaurante',
    menuItems: 'Elementos del Menú',
    qrCode: 'Códigos QR',
    login: 'Iniciar Sesión',
    username: 'Usuario',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    callWaiter: 'Llamar al Mesero',
    welcome: 'Bienvenido',
    chooseLanguage: 'Elige tu Idioma',
    viewMenu: 'Ver Menú',
    suggested: 'Recomendaciones del Chef',
    addToCart: 'Agregar al Carrito',
    quantity: 'Cantidad',
    cart: 'Carrito',
    notes: 'Solicitudes Especiales',
    notesPlaceholder: 'Agrega solicitudes especiales o notas...',
    total: 'Total',
    placeOrder: 'Hacer Pedido',
    continueMenu: 'Seguir Comprando',
    emptyCart: 'Tu carrito está vacío',
  },
  fr: {
    menu: 'Menu',
    categories: 'Catégories',
    all: 'Tout',
    hours: 'Horaires',
    address: 'Adresse',
    phone: 'Téléphone',
    aboutUs: 'À Propos',
    selectLanguage: 'Choisir la Langue',
    english: 'Anglais',
    spanish: 'Espagnol',
    french: 'Français',
    persian: 'Persan',
    turkish: 'Turc',
    hello: 'Bonjour',
    profile: 'Profil',
    changePassword: 'Changer le Mot de Passe',
    signOut: 'Déconnexion',
    settings: 'Paramètres',
    branches: 'Succursales',
    tables: 'Tables',
    roles: 'Rôles et Utilisateurs',
    languages: 'Langues',
    materials: 'Ingrédients',
    types: 'Types d\'Aliments',
    dashboard: 'Tableau de Bord',
    restaurant: 'Info Restaurant',
    menuItems: 'Éléments du Menu',
    qrCode: 'Codes QR',
    login: 'Connexion',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié?',
    callWaiter: 'Appeler le Serveur',
    welcome: 'Bienvenue',
    chooseLanguage: 'Choisissez votre Langue',
    viewMenu: 'Voir le Menu',
    suggested: 'Recommandations du Chef',
    addToCart: 'Ajouter au Panier',
    quantity: 'Quantité',
    cart: 'Panier',
    notes: 'Demandes Spéciales',
    notesPlaceholder: 'Ajouter des demandes spéciales ou notes...',
    total: 'Total',
    placeOrder: 'Passer la Commande',
    continueMenu: 'Continuer les Achats',
    emptyCart: 'Votre panier est vide',
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
    spanish: 'اسپانیایی',
    french: 'فرانسوی',
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
    spanish: 'İspanyolca',
    french: 'Fransızca',
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
