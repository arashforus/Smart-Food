import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/admin/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X, Lock, CreditCard, FileText, Eye, EyeOff, Trash2, Clock, User, Sliders, Building2, LogIn, QrCode, Palette, Menu, DollarSign, Users, Award, Code, Tv2, Banknote } from 'lucide-react';
import { SiInstagram, SiTelegram } from 'react-icons/si';
import { useLocation } from 'wouter';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { mockSettings, mockLanguages } from '@/lib/mockData';
import type { Settings as SettingsType } from '@/lib/types';
import QRCodeDesigner from '@/components/admin/QRCodeDesigner';
import { useOrders, type OSSSettings } from '@/lib/orderContext';
import { useLanguage } from '@/hooks/use-language';

import logoDark from "@/assets/images/logo-dark.png";
import logoLight from "@/assets/images/logo-light.png";

const settingsSchema = z.object({
  primaryColor: z.string().min(1, 'Primary color is required'),
  showBuyButton: z.boolean(),
  showMoreInformationPopup: z.boolean(),
  menuLogoShowBackground: z.boolean(),
  menuLogoBackgroundType: z.enum(['square', 'square-low', 'square-high', 'circle']),
  menuLogoBackgroundColorLight: z.string(),
  menuLogoBackgroundColorDark: z.string(),
  defaultLanguage: z.string().min(1, 'Default language is required'),
  currencyName: z.string().min(1, 'Currency name is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  currencyPosition: z.enum(['before', 'after']).default('before'),
  currencySelect: z.string().min(1, 'Currency is required'),
  currencyDecimal: z.number().min(0).max(4).default(2),
  paymentMethod: z.enum(['cash', 'card', 'both']),
  licenseKey: z.string().optional(),
  licenseExpiry: z.string().optional(),
  licenseOwner: z.string().optional(),
  restaurantInstagram: z.string().optional(),
  restaurantWhatsapp: z.string().optional(),
  restaurantTelegram: z.string().optional(),
  restaurantGoogleMapsUrl: z.string().optional(),
  kdShowTableNumber: z.boolean().default(true),
  kdShowOrderTime: z.boolean().default(true),
  kdShowClock: z.boolean().default(true),
  kdShowNotes: z.boolean().default(true),
  kdHasPendingStatus: z.boolean().default(true),
  kdShowRecentlyCompleted: z.boolean().default(true),
  kdPendingColor: z.string().default("#FF9800"),
  kdPreparingColor: z.string().default("#2196F3"),
  kdReadyColor: z.string().default("#4CAF50"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const adminSections = [
  'Dashboard',
  'Categories',
  'Menu Items',
  'QR Codes',
  'New Order',
  'Orders',
  'Kitchen Display',
  'Order Status Screen',
  'Branches',
  'Tables',
  'Roles',
  'Users',
  'Languages',
  'Materials',
  'Food Types',
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'IRR', symbol: '﷼', name: 'Iranian Rial' },
];

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

import { useTheme } from '@/hooks/use-theme-hook';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const logoImg = theme === 'dark' ? logoLight : logoDark;
  const { toast } = useToast();
  const [location] = useLocation();
  const { ossSettings, updateOSSSettings } = useOrders();

  const { data: dbSettings, isLoading: isLoadingSettings } = useQuery<any>({
    queryKey: ['/api/settings'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PATCH', '/api/settings', data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t('failed_update_settings', 'Failed to update settings'));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({ title: t('success', 'Success'), description: t('settings_updated_desc', 'All settings have been updated successfully.'), variant: 'default' });
    },
    onError: (error: any) => {
      let errorMessage = t('failed_update_settings', 'Failed to update settings');
      if (error && typeof error === 'object' && error.message) {
        errorMessage = error.message;
      }
      toast({ title: t('error', 'Error'), description: errorMessage, variant: 'destructive' });
    }
  });

  const resetSettingsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/settings/reset', {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({ title: t('settings_reset', 'Settings Reset'), description: t('settings_restored_desc', 'All settings have been restored to their default values.') });
      queryClient.invalidateQueries();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error) => {
      toast({ title: t('error', 'Error'), description: t('failed_reset_settings', 'Failed to reset settings'), variant: 'destructive' });
    }
  });

  const [settings, setSettings] = useState<SettingsType>(mockSettings);
  const [profileName, setProfileName] = useState(localStorage.getItem('profileName') || 'John Admin');
  const [profileEmail, setProfileEmail] = useState(localStorage.getItem('profileEmail') || 'admin@restaurant.com');
  const [profilePhone, setProfilePhone] = useState(localStorage.getItem('profilePhone') || '+1 234 567 890');
  const [profileAvatar, setProfileAvatar] = useState(localStorage.getItem('profileAvatar') || '');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantDescription, setRestaurantDescription] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantPhone, setRestaurantPhone] = useState('');
  const [restaurantEmail, setRestaurantEmail] = useState('');
  const [restaurantInstagram, setRestaurantInstagram] = useState('');
  const [restaurantTelegram, setRestaurantTelegram] = useState('');
  const [timezone, setTimezone] = useState('UTC+1');
  const [showPrices, setShowPrices] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [showBuyButton, setShowBuyButton] = useState(true);

  const timezones = [
    { value: 'UTC-8', label: '(UTC-08:00) Pacific Time' },
    { value: 'UTC-5', label: '(UTC-05:00) Eastern Time' },
    { value: 'UTC+0', label: '(UTC+00:00) London' },
    { value: 'UTC+1', label: '(UTC+01:00) Paris/Berlin' },
    { value: 'UTC+2', label: '(UTC+02:00) Cairo/Istanbul' },
    { value: 'UTC+3', label: '(UTC+03:00) Tehran/Moscow' },
    { value: 'UTC+4', label: '(UTC+04:00) Dubai' },
    { value: 'UTC+8', label: '(UTC+08:00) Beijing/Singapore' },
  ];

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      primaryColor: '#4CAF50',
      showBuyButton: true,
      showMoreInformationPopup: true,
      defaultLanguage: 'en',
      currencySelect: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      currencyPosition: 'before',
      currencyDecimal: 2,
      paymentMethod: 'cash',
      kdShowTableNumber: true,
      kdShowOrderTime: true,
      kdShowClock: true,
      kdShowNotes: true,
      kdHasPendingStatus: true,
      kdShowRecentlyCompleted: true,
      kdPendingColor: '#FF9800',
      kdPreparingColor: '#2196F3',
      kdReadyColor: '#4CAF50',
      menuLogoShowBackground: false,
      menuLogoBackgroundType: 'square',
      menuLogoBackgroundColorLight: '#ffffff',
      menuLogoBackgroundColorDark: '#1a1a1a',
    },
  });

  useEffect(() => {
    if (dbSettings) {
      setRestaurantName(dbSettings.restaurantName || '');
      setRestaurantDescription(dbSettings.restaurantDescription || '');
      setRestaurantAddress(dbSettings.restaurantAddress || '');
      setRestaurantPhone(dbSettings.restaurantPhone || '');
      setRestaurantEmail(dbSettings.restaurantEmail || '');
      setRestaurantInstagram(dbSettings.restaurantInstagram || '');
      setRestaurantTelegram(dbSettings.restaurantTelegram || '');
      setTimezone(dbSettings.timezone || 'UTC+1');
      setShowPrices(dbSettings.menuShowPrices !== false);
      setShowImages(dbSettings.menuShowImages !== false);
      setShowBuyButton(dbSettings.menuShowBuyButton !== false);
      form.reset({
        ...dbSettings,
        primaryColor: dbSettings.primaryColor || '#4CAF50',
        defaultLanguage: dbSettings.defaultLanguage || 'en',
      });
    }
  }, [dbSettings, form]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t('settings', 'Settings')}</h1>
          <p className="text-muted-foreground">{t('settings_desc', 'Manage your restaurant configuration and system settings')}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => resetSettingsMutation.mutate()}
            disabled={resetSettingsMutation.isPending}
            data-testid="button-reset-settings"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('reset_to_defaults', 'Reset to Defaults')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
          <TabsTrigger value="restaurant" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="w-4 h-4 mr-2" />
            {t('restaurant_info', 'Restaurant Info')}
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sliders className="w-4 h-4 mr-2" />
            {t('general_settings', 'General Settings')}
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="w-4 h-4 mr-2" />
            {t('profile', 'Profile')}
          </TabsTrigger>
          <TabsTrigger value="menu-display" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Menu className="w-4 h-4 mr-2" />
            {t('menu_display', 'Menu Display')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant">
          <Card>
            <CardHeader>
              <CardTitle>{t('restaurant_information', 'Restaurant Information')}</CardTitle>
              <CardDescription>{t('restaurant_info_desc', 'Basic information about your restaurant')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>{t('restaurant_name', 'Restaurant Name')}</FormLabel>
                  <Input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} placeholder={t('restaurant_name_placeholder', 'Enter restaurant name')} />
                </div>
                <div className="space-y-2">
                  <FormLabel>{t('restaurant_email', 'Restaurant Email')}</FormLabel>
                  <Input value={restaurantEmail} onChange={(e) => setRestaurantEmail(e.target.value)} placeholder={t('restaurant_email_placeholder', 'Enter contact email')} />
                </div>
                <div className="space-y-2">
                  <FormLabel>{t('restaurant_phone', 'Restaurant Phone')}</FormLabel>
                  <Input value={restaurantPhone} onChange={(e) => setRestaurantPhone(e.target.value)} placeholder={t('restaurant_phone_placeholder', 'Enter contact phone')} />
                </div>
                <div className="space-y-2">
                  <FormLabel>{t('restaurant_address', 'Restaurant Address')}</FormLabel>
                  <Input value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)} placeholder={t('restaurant_address_placeholder', 'Enter physical address')} />
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel>{t('restaurant_description', 'Restaurant Description')}</FormLabel>
                <Textarea value={restaurantDescription} onChange={(e) => setRestaurantDescription(e.target.value)} placeholder={t('restaurant_description_placeholder', 'Describe your restaurant')} className="min-h-[100px]" />
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => updateSettingsMutation.mutate({ restaurantName, restaurantDescription, restaurantAddress, restaurantPhone, restaurantEmail })} disabled={updateSettingsMutation.isPending}>
                  {t('save_changes', 'Save Changes')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('general_settings', 'General Settings')}</CardTitle>
              <CardDescription>{t('general_settings_desc', 'Configure core system behaviors')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>{t('default_language', 'Default Language')}</FormLabel>
                  <Select value={form.getValues('defaultLanguage')} onValueChange={(val) => form.setValue('defaultLanguage', val)}>
                    <SelectTrigger><SelectValue placeholder={t('select_language', 'Select language')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fa">Persian</SelectItem>
                      <SelectItem value="tr">Turkish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <FormLabel>{t('timezone', 'Timezone')}</FormLabel>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger><SelectValue placeholder={t('select_timezone', 'Select timezone')} /></SelectTrigger>
                    <SelectContent>{timezones.map((tz) => (<SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => updateSettingsMutation.mutate({ defaultLanguage: form.getValues('defaultLanguage'), timezone })} disabled={updateSettingsMutation.isPending}>
                  {t('save_changes', 'Save Changes')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('my_profile', 'My Profile')}</CardTitle>
              <CardDescription>{t('profile_desc', 'Manage your account information')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>{t('full_name', 'Full Name')}</FormLabel>
                  <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder={t('full_name_placeholder', 'Enter your full name')} />
                </div>
                <div className="space-y-2">
                  <FormLabel>{t('email', 'Email')}</FormLabel>
                  <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder={t('email_placeholder', 'Enter your email')} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => { localStorage.setItem('profileName', profileName); localStorage.setItem('profileEmail', profileEmail); toast({ title: t('profile_updated', 'Profile Updated'), description: t('profile_saved_desc', 'Your profile has been saved successfully.') }); }}>
                  {t('save_changes', 'Save Changes')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu-display">
          <Card>
            <CardHeader>
              <CardTitle>{t('menu_display_settings', 'Menu Display Settings')}</CardTitle>
              <CardDescription>{t('menu_display_desc', 'Control what information is shown on the digital menu')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>{t('show_prices', 'Show Prices')}</FormLabel>
                    <FormDescription>{t('show_prices_desc', 'Display item prices on the menu')}</FormDescription>
                  </div>
                  <Switch checked={showPrices} onCheckedChange={setShowPrices} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>{t('show_images', 'Show Images')}</FormLabel>
                    <FormDescription>{t('show_images_desc', 'Display item images on the menu')}</FormDescription>
                  </div>
                  <Switch checked={showImages} onCheckedChange={setShowImages} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>{t('show_buy_button', 'Show Buy Button')}</FormLabel>
                    <FormDescription>{t('show_buy_desc', 'Allow customers to add items to cart')}</FormDescription>
                  </div>
                  <Switch checked={showBuyButton} onCheckedChange={setShowBuyButton} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => updateSettingsMutation.mutate({ menuShowPrices: showPrices, menuShowImages: showImages, menuShowBuyButton: showBuyButton })} disabled={updateSettingsMutation.isPending}>
                  {t('save_changes', 'Save Changes')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
