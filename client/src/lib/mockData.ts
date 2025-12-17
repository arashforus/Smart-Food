import type { Restaurant, Category, MenuItem, Branch, RestaurantTable, User, AppLanguage, Material, FoodType, Settings, DashboardMetrics } from './types';

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
  mapLat: 40.7128,
  mapLng: -74.0060,
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
    shortDescription: { 
      en: 'Toasted bread with fresh tomatoes',
      es: 'Pan tostado con tomates frescos',
      fr: 'Pain grillé avec tomates fraîches',
      fa: 'نان تست با گوجه تازه',
      tr: 'Taze domatesli kızarmış ekmek'
    },
    longDescription: { 
      en: 'Toasted bread topped with fresh tomatoes, basil, and garlic, drizzled with extra virgin olive oil and balsamic glaze',
      es: 'Pan tostado con tomates frescos, albahaca y ajo, rociado con aceite de oliva virgen extra y glaseado balsámico',
      fr: 'Pain grillé garni de tomates fraîches, basilic et ail, arrosé d\'huile d\'olive extra vierge et de glaçage balsamique',
      fa: 'نان تست شده با گوجه فرنگی تازه، ریحان و سیر، با روغن زیتون و سس بالزامیک',
      tr: 'Taze domates, fesleğen ve sarımsakla kaplanmış, sızma zeytinyağı ve balzamik glazür ile süslenmiş kızarmış ekmek'
    },
    price: 9.99,
    discountedPrice: 7.99,
    maxSelect: 5,
    categoryId: '1',
    available: true,
    materials: ['1', '3', '4'],
    types: ['2'],
  },
  {
    id: '2',
    name: { en: 'Calamari Fritti', es: 'Calamares Fritos', fr: 'Calamars Frits', fa: 'کالاماری سرخ شده', tr: 'Kalamar Tava' },
    shortDescription: { 
      en: 'Crispy fried squid',
      es: 'Calamares crujientes',
      fr: 'Calamars croustillants',
      fa: 'ماهی مرکب سرخ شده',
      tr: 'Çıtır kalamar'
    },
    longDescription: { 
      en: 'Crispy fried squid served with marinara sauce and lemon wedges, perfectly seasoned with our secret blend of herbs',
      es: 'Calamares crujientes servidos con salsa marinara y rodajas de limón, perfectamente sazonados con nuestra mezcla secreta de hierbas',
      fr: 'Calamars croustillants servis avec sauce marinara et quartiers de citron, parfaitement assaisonnés avec notre mélange secret d\'herbes',
      fa: 'ماهی مرکب سرخ شده ترد با سس مارینارا و لیمو، با ترکیب مخصوص ادویه‌جات',
      tr: 'Marinara sosu ve limon dilimleri ile servis edilen, gizli baharat karışımımızla mükemmel tatlandırılmış çıtır kalamar'
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
    shortDescription: { 
      en: 'Classic pasta with pancetta',
      es: 'Pasta clásica con panceta',
      fr: 'Pâtes classiques avec pancetta',
      fa: 'پاستا کلاسیک با پنچتا',
      tr: 'Pancettalı klasik makarna'
    },
    longDescription: { 
      en: 'Classic pasta with pancetta, egg, parmesan, and black pepper, prepared in the traditional Roman style',
      es: 'Pasta clásica con panceta, huevo, parmesano y pimienta negra, preparada al estilo romano tradicional',
      fr: 'Pâtes classiques avec pancetta, œuf, parmesan et poivre noir, préparées dans le style romain traditionnel',
      fa: 'پاستا کلاسیک با پنچتا، تخم مرغ، پارمزان و فلفل سیاه، به سبک سنتی رومی',
      tr: 'Pancetta, yumurta, parmesan ve karabiberli, geleneksel Roma tarzında hazırlanmış klasik makarna'
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
    shortDescription: { 
      en: 'Traditional pizza with mozzarella',
      es: 'Pizza tradicional con mozzarella',
      fr: 'Pizza traditionnelle avec mozzarella',
      fa: 'پیتزا سنتی با موزارلا',
      tr: 'Mozzarellalı geleneksel pizza'
    },
    longDescription: { 
      en: 'Traditional pizza with fresh mozzarella, tomatoes, and basil on our hand-tossed dough baked in a wood-fired oven',
      es: 'Pizza tradicional con mozzarella fresca, tomates y albahaca en nuestra masa artesanal horneada en horno de leña',
      fr: 'Pizza traditionnelle avec mozzarella fraîche, tomates et basilic sur notre pâte artisanale cuite au four à bois',
      fa: 'پیتزا سنتی با موزارلا تازه، گوجه و ریحان روی خمیر دست‌ساز پخته در تنور هیزمی',
      tr: 'Taze mozzarella, domates ve fesleğenli, odun ateşinde pişirilmiş el yapımı hamurlu geleneksel pizza'
    },
    price: 16.99,
    discountedPrice: 14.99,
    maxSelect: 3,
    categoryId: '2',
    available: true,
    materials: ['1', '2', '3'],
    types: ['2'],
  },
  {
    id: '5',
    name: { en: 'Grilled Salmon', es: 'Salmón a la Parrilla', fr: 'Saumon Grillé', fa: 'سالمون کبابی', tr: 'Izgara Somon' },
    shortDescription: { 
      en: 'Fresh Atlantic salmon',
      es: 'Salmón del Atlántico fresco',
      fr: 'Saumon de l\'Atlantique frais',
      fa: 'سالمون آتلانتیک تازه',
      tr: 'Taze Atlantik somonu'
    },
    longDescription: { 
      en: 'Fresh Atlantic salmon with lemon herb butter and seasonal vegetables, grilled to perfection',
      es: 'Salmón del Atlántico fresco con mantequilla de hierbas y limón y verduras de temporada, a la parrilla a la perfección',
      fr: 'Saumon de l\'Atlantique frais avec beurre aux herbes et citron et légumes de saison, grillé à la perfection',
      fa: 'سالمون آتلانتیک تازه با کره لیمو و سبزیجات فصلی، کباب شده به بهترین شکل',
      tr: 'Limonlu otlu tereyağı ve mevsim sebzeleri ile mükemmel şekilde ızgara edilmiş taze Atlantik somonu'
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
    shortDescription: { 
      en: 'Classic Italian dessert',
      es: 'Postre italiano clásico',
      fr: 'Dessert italien classique',
      fa: 'دسر کلاسیک ایتالیایی',
      tr: 'Klasik İtalyan tatlısı'
    },
    longDescription: { 
      en: 'Classic Italian dessert with espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa',
      es: 'Postre italiano clásico con bizcochos empapados en espresso, capas de crema de mascarpone y espolvoreado con cacao',
      fr: 'Dessert italien classique avec biscuits imbibés d\'espresso, couches de crème au mascarpone et saupoudré de cacao',
      fa: 'دسر کلاسیک ایتالیایی با بیسکویت آغشته به اسپرسو، لایه‌های کرم ماسکارپونه و پودر کاکائو',
      tr: 'Espresso emdirilmiş bisküvi, mascarpone kreması katmanları ve kakao tozu serpilmiş klasik İtalyan tatlısı'
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
    shortDescription: { 
      en: 'Creamy vanilla custard',
      es: 'Crema de vainilla',
      fr: 'Crème vanille',
      fa: 'کاستارد وانیلی',
      tr: 'Kremalı vanilya muhallebisi'
    },
    longDescription: { 
      en: 'Creamy vanilla custard with berry compote, a silky smooth Italian classic',
      es: 'Crema de vainilla con compota de frutos rojos, un clásico italiano sedoso',
      fr: 'Crème vanille avec compote de fruits rouges, un classique italien soyeux',
      fa: 'کاستارد وانیلی خامه‌ای با کمپوت توت، یک دسر کلاسیک ایتالیایی نرم',
      tr: 'Meyveli komposto ile ipeksi pürüzsüz İtalyan klasiği kremalı vanilya muhallebisi'
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
    shortDescription: { 
      en: 'Refreshing sparkling water',
      es: 'Agua con gas refrescante',
      fr: 'Eau pétillante rafraîchissante',
      fa: 'آب گازدار تازه',
      tr: 'Ferahlatıcı maden suyu'
    },
    longDescription: { 
      en: 'Refreshing sparkling water with your choice of syrup - strawberry, raspberry, or lemon',
      es: 'Agua con gas refrescante con jarabe a elección - fresa, frambuesa o limón',
      fr: 'Eau pétillante rafraîchissante avec sirop au choix - fraise, framboise ou citron',
      fa: 'آب گازدار تازه با شربت دلخواه شما - توت فرنگی، تمشک یا لیمو',
      tr: 'Seçtiğiniz şurupla ferahlatıcı maden suyu - çilek, ahududu veya limon'
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
    shortDescription: { 
      en: 'Rich Italian espresso',
      es: 'Espresso italiano rico',
      fr: 'Espresso italien riche',
      fa: 'اسپرسو ایتالیایی غنی',
      tr: 'Zengin İtalyan espresso'
    },
    longDescription: { 
      en: 'Rich Italian espresso, single or double shot, made from our premium roasted coffee beans',
      es: 'Espresso italiano rico, simple o doble, hecho con nuestros granos de café premium',
      fr: 'Espresso italien riche, simple ou double, fait avec nos grains de café premium',
      fa: 'اسپرسو ایتالیایی غنی، تک یا دوبل، از دانه‌های قهوه برشته ممتاز ما',
      tr: 'Premium kavrulmuş kahve çekirdeklerimizden yapılan zengin İtalyan espresso, tek veya çift shot'
    },
    price: 3.99,
    categoryId: '4',
    available: true,
    materials: [],
    types: ['1'],
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalItems: mockMenuItems.length,
  totalCategories: mockCategories.length,
  availableItems: mockMenuItems.filter(i => i.available).length,
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
