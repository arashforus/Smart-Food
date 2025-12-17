import type { Restaurant, Category, MenuItem, Branch, RestaurantTable, User, AppLanguage, Material, FoodType, Settings } from './types';

export const mockRestaurant: Restaurant = {
  id: '1',
  name: 'La Bella Cucina',
  description: 'Authentic Italian cuisine crafted with passion and the finest ingredients.',
  address: '123 Main Street, Downtown',
  phone: '+1 (555) 123-4567',
  email: 'info@labellacucina.com',
  hours: 'Mon-Thu: 11am-10pm | Fri-Sat: 11am-11pm | Sun: 12pm-9pm',
  currency: 'USD',
  currencySymbol: '$',
};

export const mockBranches: Branch[] = [
  { id: '1', name: 'Downtown Branch', address: '123 Main Street', phone: '+1 (555) 123-4567', isActive: true },
  { id: '2', name: 'Uptown Branch', address: '456 Oak Avenue', phone: '+1 (555) 234-5678', isActive: true },
  { id: '3', name: 'Airport Location', address: '789 Terminal Rd', phone: '+1 (555) 345-6789', isActive: false },
];

export const mockTables: RestaurantTable[] = [
  { id: '1', branchId: '1', number: 'T1', seats: 2, isActive: true },
  { id: '2', branchId: '1', number: 'T2', seats: 4, isActive: true },
  { id: '3', branchId: '1', number: 'T3', seats: 6, isActive: true },
  { id: '4', branchId: '1', number: 'T4', seats: 4, isActive: true },
  { id: '5', branchId: '2', number: 'A1', seats: 2, isActive: true },
  { id: '6', branchId: '2', number: 'A2', seats: 4, isActive: true },
];

export const mockUsers: User[] = [
  { id: '1', name: 'John Admin', email: 'admin@restaurant.com', role: 'admin', isActive: true },
  { id: '2', name: 'Sarah Manager', email: 'manager@restaurant.com', role: 'manager', branchId: '1', isActive: true },
  { id: '3', name: 'Mike Chef', email: 'chef@restaurant.com', role: 'chef', branchId: '1', isActive: true },
  { id: '4', name: 'Lisa Accountant', email: 'accountant@restaurant.com', role: 'accountant', isActive: true },
];

export const mockCurrentUser: User = mockUsers[0];

export const mockLanguages: AppLanguage[] = [
  { id: '1', code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', isActive: true, isDefault: true },
  { id: '2', code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', isActive: true, isDefault: false },
  { id: '3', code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', isActive: true, isDefault: false },
  { id: '4', code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl', isActive: true, isDefault: false },
  { id: '5', code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', isActive: true, isDefault: false },
];

export const mockMaterials: Material[] = [
  { id: '1', name: { en: 'Tomato', es: 'Tomate', fr: 'Tomate', fa: 'گوجه', tr: 'Domates' }, backgroundColor: '#FF6B6B' },
  { id: '2', name: { en: 'Cheese', es: 'Queso', fr: 'Fromage', fa: 'پنیر', tr: 'Peynir' }, backgroundColor: '#FFD93D' },
  { id: '3', name: { en: 'Basil', es: 'Albahaca', fr: 'Basilic', fa: 'ریحان', tr: 'Fesleğen' }, backgroundColor: '#6BCB77' },
  { id: '4', name: { en: 'Garlic', es: 'Ajo', fr: 'Ail', fa: 'سیر', tr: 'Sarımsak' }, backgroundColor: '#F5F5DC' },
  { id: '5', name: { en: 'Olive Oil', es: 'Aceite de Oliva', fr: 'Huile d\'Olive', fa: 'روغن زیتون', tr: 'Zeytinyağı' }, backgroundColor: '#C4A35A' },
];

export const mockFoodTypes: FoodType[] = [
  { id: '1', name: { en: 'Vegan', es: 'Vegano', fr: 'Végan', fa: 'گیاهی', tr: 'Vegan' }, icon: 'leaf', color: '#4CAF50' },
  { id: '2', name: { en: 'Vegetarian', es: 'Vegetariano', fr: 'Végétarien', fa: 'گیاه‌خوار', tr: 'Vejetaryen' }, icon: 'salad', color: '#8BC34A' },
  { id: '3', name: { en: 'Gluten Free', es: 'Sin Gluten', fr: 'Sans Gluten', fa: 'بدون گلوتن', tr: 'Glutensiz' }, icon: 'wheat-off', color: '#FF9800' },
  { id: '4', name: { en: 'Spicy', es: 'Picante', fr: 'Épicé', fa: 'تند', tr: 'Acı' }, icon: 'flame', color: '#F44336' },
  { id: '5', name: { en: 'Healthy', es: 'Saludable', fr: 'Sain', fa: 'سالم', tr: 'Sağlıklı' }, icon: 'heart', color: '#E91E63' },
];

export const mockSettings: Settings = {
  id: '1',
  primaryColor: '#0079F2',
  menuTitle: 'Our Menu',
  showPrices: true,
  showImages: true,
  showMaterials: true,
  showTypes: true,
  defaultLanguage: 'en',
};

export const mockCategories: Category[] = [
  { id: '1', name: { en: 'Appetizers', es: 'Aperitivos', fr: 'Entrées', fa: 'پیش‌غذا', tr: 'Başlangıçlar' }, order: 1 },
  { id: '2', name: { en: 'Main Courses', es: 'Platos Principales', fr: 'Plats Principaux', fa: 'غذای اصلی', tr: 'Ana Yemekler' }, order: 2 },
  { id: '3', name: { en: 'Desserts', es: 'Postres', fr: 'Desserts', fa: 'دسر', tr: 'Tatlılar' }, order: 3 },
  { id: '4', name: { en: 'Beverages', es: 'Bebidas', fr: 'Boissons', fa: 'نوشیدنی', tr: 'İçecekler' }, order: 4 },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: { en: 'Bruschetta', es: 'Bruschetta', fr: 'Bruschetta', fa: 'بروسکتا', tr: 'Bruschetta' },
    description: { 
      en: 'Toasted bread topped with fresh tomatoes, basil, and garlic',
      es: 'Pan tostado con tomates frescos, albahaca y ajo',
      fr: 'Pain grillé garni de tomates fraîches, basilic et ail',
      fa: 'نان تست شده با گوجه فرنگی تازه، ریحان و سیر',
      tr: 'Taze domates, fesleğen ve sarımsakla kaplanmış kızarmış ekmek'
    },
    price: 9.99,
    categoryId: '1',
    available: true,
    materials: ['1', '3', '4'],
    types: ['2'],
  },
  {
    id: '2',
    name: { en: 'Calamari Fritti', es: 'Calamares Fritos', fr: 'Calamars Frits', fa: 'کالاماری سرخ شده', tr: 'Kalamar Tava' },
    description: { 
      en: 'Crispy fried squid served with marinara sauce',
      es: 'Calamares crujientes servidos con salsa marinara',
      fr: 'Calamars croustillants servis avec sauce marinara',
      fa: 'ماهی مرکب سرخ شده ترد با سس مارینارا',
      tr: 'Marinara sosu ile servis edilen çıtır kalamar'
    },
    price: 14.99,
    categoryId: '1',
    available: true,
    materials: ['1'],
    types: [],
  },
  {
    id: '3',
    name: { en: 'Spaghetti Carbonara', es: 'Espagueti Carbonara', fr: 'Spaghetti Carbonara', fa: 'اسپاگتی کاربونارا', tr: 'Spaghetti Carbonara' },
    description: { 
      en: 'Classic pasta with pancetta, egg, parmesan, and black pepper',
      es: 'Pasta clásica con panceta, huevo, parmesano y pimienta negra',
      fr: 'Pâtes classiques avec pancetta, œuf, parmesan et poivre noir',
      fa: 'پاستا کلاسیک با پنچتا، تخم مرغ، پارمزان و فلفل سیاه',
      tr: 'Pancetta, yumurta, parmesan ve karabiberli klasik makarna'
    },
    price: 18.99,
    categoryId: '2',
    available: true,
    materials: ['2', '4'],
    types: [],
  },
  {
    id: '4',
    name: { en: 'Margherita Pizza', es: 'Pizza Margherita', fr: 'Pizza Margherita', fa: 'پیتزا مارگاریتا', tr: 'Margherita Pizza' },
    description: { 
      en: 'Traditional pizza with fresh mozzarella, tomatoes, and basil',
      es: 'Pizza tradicional con mozzarella fresca, tomates y albahaca',
      fr: 'Pizza traditionnelle avec mozzarella fraîche, tomates et basilic',
      fa: 'پیتزا سنتی با موزارلا تازه، گوجه و ریحان',
      tr: 'Taze mozzarella, domates ve fesleğenli geleneksel pizza'
    },
    price: 16.99,
    categoryId: '2',
    available: true,
    materials: ['1', '2', '3'],
    types: ['2'],
  },
  {
    id: '5',
    name: { en: 'Grilled Salmon', es: 'Salmón a la Parrilla', fr: 'Saumon Grillé', fa: 'سالمون کبابی', tr: 'Izgara Somon' },
    description: { 
      en: 'Fresh Atlantic salmon with lemon herb butter and vegetables',
      es: 'Salmón del Atlántico con mantequilla de hierbas y limón',
      fr: 'Saumon de l\'Atlantique avec beurre aux herbes et citron',
      fa: 'سالمون آتلانتیک تازه با کره لیمو و سبزیجات',
      tr: 'Limonlu otlu tereyağı ve sebzelerle taze Atlantik somonu'
    },
    price: 24.99,
    categoryId: '2',
    available: true,
    materials: ['5'],
    types: ['5', '3'],
  },
  {
    id: '6',
    name: { en: 'Tiramisu', es: 'Tiramisú', fr: 'Tiramisu', fa: 'تیرامیسو', tr: 'Tiramisu' },
    description: { 
      en: 'Classic Italian dessert with espresso-soaked ladyfingers',
      es: 'Postre italiano clásico con bizcochos empapados en espresso',
      fr: 'Dessert italien classique avec biscuits imbibés d\'espresso',
      fa: 'دسر کلاسیک ایتالیایی با بیسکویت آغشته به اسپرسو',
      tr: 'Espresso emdirilmiş bisküvili klasik İtalyan tatlısı'
    },
    price: 8.99,
    categoryId: '3',
    available: true,
    materials: ['2'],
    types: ['2'],
  },
  {
    id: '7',
    name: { en: 'Panna Cotta', es: 'Panna Cotta', fr: 'Panna Cotta', fa: 'پاناکوتا', tr: 'Panna Cotta' },
    description: { 
      en: 'Creamy vanilla custard with berry compote',
      es: 'Crema de vainilla con compota de frutos rojos',
      fr: 'Crème vanille avec compote de fruits rouges',
      fa: 'کاستارد وانیلی خامه‌ای با کمپوت توت',
      tr: 'Meyveli komposto ile kremalı vanilya muhallebisi'
    },
    price: 7.99,
    categoryId: '3',
    available: true,
    materials: [],
    types: ['2'],
  },
  {
    id: '8',
    name: { en: 'Italian Soda', es: 'Soda Italiana', fr: 'Soda Italien', fa: 'نوشابه ایتالیایی', tr: 'İtalyan Soda' },
    description: { 
      en: 'Refreshing sparkling water with your choice of syrup',
      es: 'Agua con gas refrescante con jarabe a elección',
      fr: 'Eau pétillante rafraîchissante avec sirop au choix',
      fa: 'آب گازدار تازه با شربت دلخواه شما',
      tr: 'Seçtiğiniz şurupla ferahlatıcı maden suyu'
    },
    price: 4.99,
    categoryId: '4',
    available: true,
    materials: [],
    types: ['1'],
  },
  {
    id: '9',
    name: { en: 'Espresso', es: 'Espresso', fr: 'Espresso', fa: 'اسپرسو', tr: 'Espresso' },
    description: { 
      en: 'Rich Italian espresso, single or double shot',
      es: 'Espresso italiano rico, simple o doble',
      fr: 'Espresso italien riche, simple ou double',
      fa: 'اسپرسو ایتالیایی غنی، تک یا دوبل',
      tr: 'Zengin İtalyan espresso, tek veya çift shot'
    },
    price: 3.99,
    categoryId: '4',
    available: true,
    materials: [],
    types: ['1'],
  },
];
