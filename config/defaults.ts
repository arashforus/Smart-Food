/**
 * Default Settings Configuration
 * Based on all defaults from shared/schema.ts
 * Edit this file to customize the default values for the reset settings feature
 */

export const DEFAULT_SETTINGS = {
  // General
  primaryColor: '#4CAF50',
  timezone: 'UTC',
  favicon: null,
  defaultLanguage: 'en',

  // Restaurant
  restaurantLogo: null,
  restaurantName: null,
  restaurantDescription: null,
  restaurantAddress: null,
  restaurantPhone: null,
  restaurantEmail: null,
  restaurantHours: null,
  restaurantBackgroundImage: null,
  restaurantInstagram: null,
  restaurantWhatsapp: null,
  restaurantTelegram: null,
  restaurantGoogleMapsUrl: null,

  // Login Page
  loginBackgroundImage: null,
  showLoginTitle: true,
  loginTitle: '',
  showLoginResetPassword: true,

  // QR Page Content
  qrMediaUrl: null,
  qrMediaType: null,
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

  // QR Design
  qrEyeBorderColor: '#000000',
  qrEyeDotColor: '#000000',
  qrEyeBorderShape: 'square',
  qrEyeDotShape: 'square',
  qrDotsStyle: 'square',
  qrForegroundColor: '#000000',
  qrBackgroundColor: '#FFFFFF',
  qrCenterType: 'logo',
  qrCenterText: null,
  qrLogo: null,

  // Menu Page
  menuDefaultTheme: 'light',
  menuBackgroundType: 'default',
  menuBackgroundColor: null,
  menuGradientStart: null,
  menuGradientEnd: null,
  menuBackgroundImage: null,
  showMenuInstagram: true,
  showMenuWhatsapp: true,
  showMenuTelegram: true,
  showMenuLanguageSelector: true,
  showMenuThemeSwitcher: true,
  menuShowRestaurantLogo: true,
  menuShowRestaurantName: true,
  menuShowRestaurantDescription: true,
  menuShowOperationHours: true,
  menuShowMenu: true,
  menuShowAllMenuItems: true,
  menuShowRecommendedMenuItems: true,
  menuShowFoodType: true,
  menuShowSearchBar: true,
  menuShowViewSwitcher: true,
  menuShowPrices: true,
  menuShowImages: true,
  menuShowIngredients: true,
  menuShowFoodTypes: true,
  menuShowBuyButton: true,
  menuShowMoreInformationPopup: true,

  // KD (Kitchen Display)
  kdShowTableNumber: true,
  kdShowOrderTime: true,
  kdShowClock: true,
  kdShowNotes: true,
  kdHasPendingStatus: true,
  kdShowRecentlyCompleted: true,
  kdPendingColor: '#FF9800',
  kdPreparingColor: '#2196F3',
  kdReadyColor: '#4CAF50',

  // Currency
  currencyName: 'US Dollar',
  currencySymbol: '$',
  currencyPosition: 'before',

  // License
  licenseKey: null,
  licenseExpiryDate: null,
};
