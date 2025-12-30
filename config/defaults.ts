/**
 * Default Settings Configuration
 * Edit this file to customize the default values for the reset settings feature
 * These values will be used when the "Reset Settings" button is clicked in the admin panel
 */

export const DEFAULT_SETTINGS = {
  // System
  primaryColor: '#4CAF50',
  timezone: 'UTC',
  currencyName: 'US Dollar',
  currencySymbol: '$',
  defaultLanguage: 'en',

  // QR Page - Content
  qrPageTitle: 'Welcome',
  qrPageDescription: 'Please select your language to continue view the menu',
  qrPageTextColor: '#000000',

  // QR Page - Animated Texts (for cycling animation)
  // You can modify these 4 texts for different languages
  qrAnimatedTexts: [
    'Welcome',        // English
    'Hoş geldiniz',   // Turkish
    'خوش آمدید',      // Persian
    'أهلاً وسهلاً'    // Arabic
  ],

  // QR Page - Visibility Toggles
  qrShowLogo: true,
  qrShowTitle: true,
  qrShowDescription: true,
  qrShowAnimatedText: true,
  qrShowCallWaiter: true,
  qrShowAddressPhone: true,

  // QR Code Design Defaults
  qrTextColor: '#000000',
  qrEyeBorderColor: '#000000',
  qrEyeDotColor: '#000000',
  qrForegroundColor: '#000000',
  qrBackgroundColor: '#FFFFFF',
};
