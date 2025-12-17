export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  logo?: string;
  currency: string;
  currencySymbol: string;
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
  description: Record<string, string>;
  price: number;
  categoryId: string;
  image?: string;
  available: boolean;
  materials: string[];
  types: string[];
}

export interface AppLanguage {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  isActive: boolean;
  isDefault: boolean;
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

export interface Settings {
  id: string;
  primaryColor: string;
  logoUrl?: string;
  menuTitle: string;
  showPrices: boolean;
  showImages: boolean;
  showMaterials: boolean;
  showTypes: boolean;
  defaultLanguage: string;
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
