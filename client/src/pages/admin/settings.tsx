import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X, Lock, CreditCard, FileText, Eye, EyeOff, Trash2, Clock, User, Sliders, Building2, LogIn, QrCode, Palette, Menu, DollarSign, Users, Award, Code, Tv2 } from 'lucide-react';
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

const settingsSchema = z.object({
  primaryColor: z.string().min(1, 'Primary color is required'),
  menuTitle: z.string().min(1, 'Menu title is required'),
  showPrices: z.boolean(),
  showImages: z.boolean(),
  showMaterials: z.boolean(),
  showTypes: z.boolean(),
  defaultLanguage: z.string().min(1, 'Default language is required'),
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  paymentMethod: z.enum(['cash', 'card', 'both']),
  licenseKey: z.string().optional(),
  licenseExpiry: z.string().optional(),
  restaurantName: z.string().optional(),
  restaurantDescription: z.string().optional(),
  restaurantAddress: z.string().optional(),
  restaurantPhone: z.string().optional(),
  restaurantEmail: z.string().optional(),
  restaurantHours: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const adminSections = [
  'Dashboard',
  'Menu Management',
  'Orders',
  'Kitchen Display',
  'Settings',
  'Reports',
  'Users',
  'Branches',
  'Analytics',
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

export default function SettingsPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  const { ossSettings, updateOSSSettings } = useOrders();

  const { data: dbSettings, isLoading: isLoadingSettings } = useQuery<SettingsType>({
    queryKey: ['/api/settings'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<SettingsType>) => {
      const res = await apiRequest('PATCH', '/api/settings', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({ title: 'Settings Saved', description: 'All settings have been updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update settings', variant: 'destructive' });
    }
  });

  const [settings, setSettings] = useState<SettingsType>(mockSettings);
  
  useEffect(() => {
    if (dbSettings) {
      setSettings(dbSettings);
      // Update form values when DB settings load
      form.reset({
        primaryColor: dbSettings.primaryColor,
        menuTitle: dbSettings.menuTitle,
        showPrices: dbSettings.showPrices,
        showImages: dbSettings.showImages,
        showMaterials: dbSettings.showMaterials,
        showTypes: dbSettings.showTypes,
        defaultLanguage: dbSettings.defaultLanguage,
        currency: dbSettings.currency || 'USD',
        currencySymbol: dbSettings.currencySymbol || '$',
        paymentMethod: dbSettings.paymentSettings?.paymentMethod || 'both',
        licenseKey: dbSettings.licenseKey || '',
        licenseExpiry: dbSettings.licenseExpiry || '',
        restaurantName: localStorage.getItem('restaurantName') || '',
        restaurantDescription: localStorage.getItem('restaurantDescription') || '',
        restaurantAddress: localStorage.getItem('restaurantAddress') || '',
        restaurantPhone: localStorage.getItem('restaurantPhone') || '',
        restaurantEmail: localStorage.getItem('restaurantEmail') || '',
        restaurantHours: localStorage.getItem('restaurantHours') || '',
      });
    }
  }, [dbSettings]);
  const [ossForm, setOSSForm] = useState<OSSSettings>(ossSettings);
  const [isPending, setIsPending] = useState(false);
  const [loginBackgroundImage, setLoginBackgroundImage] = useState<string>(() => {
    return localStorage.getItem('loginBackgroundImage') || '';
  });
  const [loginBackgroundPreview, setLoginBackgroundPreview] = useState<string>(loginBackgroundImage);
  const [qrPageTitle, setQrPageTitle] = useState(() => localStorage.getItem('qrPageTitle') || 'Scan to Order');
  const [qrPageDescription, setQrPageDescription] = useState(() => localStorage.getItem('qrPageDescription') || '');
  const [showQrTitle, setShowQrTitle] = useState(() => localStorage.getItem('showQrTitle') !== 'false');
  const [showQrDescription, setShowQrDescription] = useState(() => localStorage.getItem('showQrDescription') !== 'false');
  const [showCallWaiter, setShowCallWaiter] = useState(() => localStorage.getItem('showCallWaiter') !== 'false');
  const [showAddressPhone, setShowAddressPhone] = useState(() => localStorage.getItem('showAddressPhone') !== 'false');
  const [qrTextColor, setQrTextColor] = useState(() => localStorage.getItem('qrTextColor') || '#000000');
  const [menuPageTitle, setMenuPageTitle] = useState(() => localStorage.getItem('menuPageTitle') || 'Our Menu');
  const [rolePermissions, setRolePermissions] = useState(() => {
    const stored = localStorage.getItem('rolePermissions');
    return stored ? JSON.parse(stored) : {
      admin: adminSections,
      manager: ['Menu Management', 'Orders', 'Kitchen Display', 'Reports'],
      chef: ['Kitchen Display', 'Orders'],
      accountant: ['Reports', 'Analytics'],
    };
  });
  const [restaurantName, setRestaurantName] = useState(() => localStorage.getItem('restaurantName') || '');
  const [restaurantDescription, setRestaurantDescription] = useState(() => localStorage.getItem('restaurantDescription') || '');
  const [restaurantAddress, setRestaurantAddress] = useState(() => localStorage.getItem('restaurantAddress') || '');
  const [restaurantPhone, setRestaurantPhone] = useState(() => localStorage.getItem('restaurantPhone') || '');
  const [restaurantEmail, setRestaurantEmail] = useState(() => localStorage.getItem('restaurantEmail') || '');
  const [restaurantHours, setRestaurantHours] = useState(() => localStorage.getItem('restaurantHours') || '');
  const [restaurantLogo, setRestaurantLogo] = useState(() => localStorage.getItem('restaurantLogo') || '');
  const [restaurantLogoPreview, setRestaurantLogoPreview] = useState(() => localStorage.getItem('restaurantLogo') || '');
  const [operatingHours, setOperatingHours] = useState(() => {
    const stored = localStorage.getItem('operatingHours');
    return stored ? JSON.parse(stored) : {
      Monday: { start: '09:00', end: '22:00', closed: false },
      Tuesday: { start: '09:00', end: '22:00', closed: false },
      Wednesday: { start: '09:00', end: '22:00', closed: false },
      Thursday: { start: '09:00', end: '22:00', closed: false },
      Friday: { start: '09:00', end: '23:00', closed: false },
      Saturday: { start: '10:00', end: '23:00', closed: false },
      Sunday: { start: '10:00', end: '21:00', closed: false },
    };
  });
  const [socialMedia, setSocialMedia] = useState(() => {
    const stored = localStorage.getItem('socialMedia');
    return stored ? JSON.parse(stored) : {
      instagram: '',
      whatsapp: '',
      telegram: '',
    };
  });
  const [googleMapsUrl, setGoogleMapsUrl] = useState(() => localStorage.getItem('googleMapsUrl') || '');

  // Profile State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileAvatarPreview, setProfileAvatarPreview] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // General Settings State
  const [timezone, setTimezone] = useState(() => localStorage.getItem('appTimezone') || 'UTC');
  const [copyrightText, setCopyrightText] = useState(() => localStorage.getItem('copyrightText') || '© 2024 Your Restaurant. All rights reserved.');
  const [favicon, setFavicon] = useState(() => localStorage.getItem('favicon') || '');
  const [faviconPreview, setFaviconPreview] = useState(() => localStorage.getItem('favicon') || '');
  
  const [showChangePassword, setShowChangePassword] = useState(() => location.includes('action=changePassword'));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileAvatarInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const languages = mockLanguages.filter((l) => l.isActive);

  const timezones = [
    { value: 'UTC-12', label: 'UTC-12:00 (Baker Island)' },
    { value: 'UTC-11', label: 'UTC-11:00 (Samoa, Midway Island)' },
    { value: 'UTC-10', label: 'UTC-10:00 (Hawaii, Aleutian Islands)' },
    { value: 'UTC-9', label: 'UTC-09:00 (Alaska)' },
    { value: 'UTC-8', label: 'UTC-08:00 (Pacific Time: US & Canada, Mexico)' },
    { value: 'UTC-7', label: 'UTC-07:00 (Mountain Time: US & Canada, Arizona)' },
    { value: 'UTC-6', label: 'UTC-06:00 (Central Time: US & Canada, Mexico)' },
    { value: 'UTC-5', label: 'UTC-05:00 (Eastern Time: US & Canada, Colombia)' },
    { value: 'UTC-4', label: 'UTC-04:00 (Atlantic Time, Venezuela, Bolivia)' },
    { value: 'UTC-3:30', label: 'UTC-03:30 (Newfoundland)' },
    { value: 'UTC-3', label: 'UTC-03:00 (Buenos Aires, Brazil, Greenland)' },
    { value: 'UTC-2', label: 'UTC-02:00 (Mid-Atlantic)' },
    { value: 'UTC-1', label: 'UTC-01:00 (Azores)' },
    { value: 'UTC+0', label: 'UTC+00:00 (London, Dublin, Lisbon, GMT)' },
    { value: 'UTC+1', label: 'UTC+01:00 (Paris, Berlin, Amsterdam, Cairo)' },
    { value: 'UTC+2', label: 'UTC+02:00 (Cairo, Istanbul, Athens, Helsinki)' },
    { value: 'UTC+3', label: 'UTC+03:00 (Moscow, Dubai, Baghdad, Istanbul)' },
    { value: 'UTC+3:30', label: 'UTC+03:30 (Iran)' },
    { value: 'UTC+4', label: 'UTC+04:00 (Dubai, Mauritius, Armenia)' },
    { value: 'UTC+4:30', label: 'UTC+04:30 (Afghanistan)' },
    { value: 'UTC+5', label: 'UTC+05:00 (Pakistan, Kazakhstan)' },
    { value: 'UTC+5:30', label: 'UTC+05:30 (India, Sri Lanka)' },
    { value: 'UTC+5:45', label: 'UTC+05:45 (Nepal)' },
    { value: 'UTC+6', label: 'UTC+06:00 (Bangladesh, Bhutan)' },
    { value: 'UTC+6:30', label: 'UTC+06:30 (Myanmar)' },
    { value: 'UTC+7', label: 'UTC+07:00 (Bangkok, Jakarta, Hanoi, Manila)' },
    { value: 'UTC+8', label: 'UTC+08:00 (Singapore, Hong Kong, Beijing, Shanghai)' },
    { value: 'UTC+8:45', label: 'UTC+08:45 (Eucla, Australia)' },
    { value: 'UTC+9', label: 'UTC+09:00 (Tokyo, Seoul, Manila)' },
    { value: 'UTC+9:30', label: 'UTC+09:30 (Adelaide, Darwin)' },
    { value: 'UTC+10', label: 'UTC+10:00 (Sydney, Brisbane, Melbourne)' },
    { value: 'UTC+10:30', label: 'UTC+10:30 (Lord Howe Island)' },
    { value: 'UTC+11', label: 'UTC+11:00 (Solomon Islands, Vanuatu)' },
    { value: 'UTC+12', label: 'UTC+12:00 (Fiji, New Zealand, Apia)' },
    { value: 'UTC+12:45', label: 'UTC+12:45 (Chatham Islands)' },
    { value: 'UTC+13', label: 'UTC+13:00 (Samoa, Tonga, Kiribati)' },
    { value: 'UTC+14', label: 'UTC+14:00 (Line Islands)' },
  ];

  useEffect(() => {
    setShowChangePassword(location.includes('action=changePassword'));
  }, [location]);

  // Load user profile data from API
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          setProfileName(user.name || '');
          setProfileEmail(user.email || '');
          setProfilePhone(user.phone || '');
          setProfileAvatar(user.avatar || '');
          setProfileAvatarPreview(user.avatar || '');
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadUserProfile();
  }, []);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      primaryColor: settings.primaryColor,
      menuTitle: settings.menuTitle,
      showPrices: settings.showPrices,
      showImages: settings.showImages,
      showMaterials: settings.showMaterials,
      showTypes: settings.showTypes,
      defaultLanguage: settings.defaultLanguage,
      currency: settings.currency || 'USD',
      currencySymbol: settings.currencySymbol || '$',
      paymentMethod: settings.paymentSettings?.paymentMethod || 'both',
      licenseKey: settings.licenseKey || '',
      licenseExpiry: settings.licenseExpiry || '',
      restaurantName,
      restaurantDescription,
      restaurantAddress,
      restaurantPhone,
      restaurantEmail,
      restaurantHours,
    },
  });

  useEffect(() => {
    const primaryColor = form.watch('primaryColor');
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary', primaryColor);
      document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
    }
  }, [form.watch('primaryColor')]);

  const handleSubmit = (data: SettingsFormData) => {
    updateSettingsMutation.mutate({
      primaryColor: data.primaryColor,
      menuTitle: data.menuTitle,
      showPrices: data.showPrices,
      showImages: data.showImages,
      showMaterials: data.showMaterials,
      showTypes: data.showTypes,
      defaultLanguage: data.defaultLanguage,
      currency: data.currency,
      currencySymbol: data.currencySymbol,
      paymentSettings: { paymentMethod: data.paymentMethod },
    });

    // Also update other local storage settings for now
    localStorage.setItem('restaurantName', data.restaurantName || '');
    localStorage.setItem('restaurantDescription', data.restaurantDescription || '');
    localStorage.setItem('restaurantAddress', data.restaurantAddress || '');
    localStorage.setItem('restaurantPhone', data.restaurantPhone || '');
    localStorage.setItem('restaurantEmail', data.restaurantEmail || '');
    localStorage.setItem('restaurantHours', data.restaurantHours || '');
    
    if (loginBackgroundImage) {
      localStorage.setItem('loginBackgroundImage', loginBackgroundImage);
    }
    localStorage.setItem('qrPageTitle', qrPageTitle);
    localStorage.setItem('qrPageDescription', qrPageDescription);
    localStorage.setItem('showQrTitle', showQrTitle.toString());
    localStorage.setItem('showQrDescription', showQrDescription.toString());
    localStorage.setItem('showCallWaiter', showCallWaiter.toString());
    localStorage.setItem('showAddressPhone', showAddressPhone.toString());
    localStorage.setItem('qrTextColor', qrTextColor);
    localStorage.setItem('menuPageTitle', menuPageTitle);
    localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
    localStorage.setItem('operatingHours', JSON.stringify(operatingHours));
    localStorage.setItem('socialMedia', JSON.stringify(socialMedia));
    localStorage.setItem('googleMapsUrl', googleMapsUrl);
    localStorage.setItem('appTimezone', timezone);
    localStorage.setItem('copyrightText', copyrightText);
    if (favicon) {
      localStorage.setItem('favicon', favicon);
    }
  };

  const handleProfileAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setProfileAvatar(imageData);
        setProfileAvatarPreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearProfileAvatar = () => {
    setProfileAvatar('');
    setProfileAvatarPreview('');
    if (profileAvatarInputRef.current) {
      profileAvatarInputRef.current.value = '';
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setFavicon(imageData);
        setFaviconPreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFavicon = () => {
    setFavicon('');
    setFaviconPreview('');
    if (faviconInputRef.current) {
      faviconInputRef.current.value = '';
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setRestaurantLogo(imageData);
        setRestaurantLogoPreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearLogo = () => {
    setRestaurantLogo('');
    setRestaurantLogoPreview('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleClearImage = () => {
    setLoginBackgroundImage('');
    setLoginBackgroundPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleRoleSection = (role: 'admin' | 'manager' | 'chef' | 'accountant', section: string) => {
    setRolePermissions((prev: Record<string, string[]>) => ({
      ...prev,
      [role]: prev[role].includes(section)
        ? prev[role].filter((s: string) => s !== section)
        : [...prev[role], section],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setLoginBackgroundImage(imageData);
        setLoginBackgroundPreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCurrencyChange = (code: string) => {
    const selected = currencies.find((c) => c.code === code);
    if (selected) {
      form.setValue('currency', selected.code);
      form.setValue('currencySymbol', selected.symbol);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Configure your admin panel, pages, and global settings</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs defaultValue={location.includes('tab=profile') ? 'profile' : 'general'} className="w-full">
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <TabsList className="grid w-full grid-cols-6 gap-1 bg-transparent h-auto p-0">
                  <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <User className="h-5 w-5" />
                    <span className="text-xs">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="general" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <Sliders className="h-5 w-5" />
                    <span className="text-xs">General</span>
                  </TabsTrigger>
                  <TabsTrigger value="restaurant" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <Building2 className="h-5 w-5" />
                    <span className="text-xs">Restaurant</span>
                  </TabsTrigger>
                  <TabsTrigger value="login" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <LogIn className="h-5 w-5" />
                    <span className="text-xs">Login Page</span>
                  </TabsTrigger>
                  <TabsTrigger value="qr" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <QrCode className="h-5 w-5" />
                    <span className="text-xs">QR Page</span>
                  </TabsTrigger>
                  <TabsTrigger value="qrcode" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <Palette className="h-5 w-5" />
                    <span className="text-xs">QR Design</span>
                  </TabsTrigger>
                  <TabsTrigger value="menu" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <Menu className="h-5 w-5" />
                    <span className="text-xs">Menu Page</span>
                  </TabsTrigger>
                  <TabsTrigger value="kd" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <Tv2 className="h-5 w-5" />
                    <span className="text-xs">KD</span>
                  </TabsTrigger>
                  <TabsTrigger value="currency" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xs">Currency</span>
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Payment</span>
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Roles</span>
                  </TabsTrigger>
                  <TabsTrigger value="license" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <Award className="h-5 w-5" />
                    <span className="text-xs">License</span>
                  </TabsTrigger>
                  <TabsTrigger value="oss" className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 hover:bg-muted/50 data-[state=active]:bg-primary/10">
                    <Code className="h-5 w-5" />
                    <span className="text-xs">OSS</span>
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Your Profile</CardTitle>
                      <CardDescription>Manage your account information</CardDescription>
                    </div>
                    {!isEditingProfile && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} data-testid="button-edit-profile">
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="profile-name">Full Name</FormLabel>
                        <Input
                          id="profile-name"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Your full name"
                          data-testid="input-profile-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="profile-email">Email</FormLabel>
                        <Input
                          id="profile-email"
                          type="email"
                          value={profileEmail}
                          disabled
                          placeholder="your.email@example.com"
                          data-testid="input-profile-email"
                        />
                        <FormDescription>Email cannot be changed. Contact support to update your email.</FormDescription>
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="profile-phone">Phone</FormLabel>
                        <Input
                          id="profile-phone"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          data-testid="input-profile-phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Profile Picture</FormLabel>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => profileAvatarInputRef.current?.click()}
                        >
                          {profileAvatarPreview ? (
                            <div className="space-y-2">
                              <img src={profileAvatarPreview} alt="Profile Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                              <p className="text-sm text-muted-foreground">Click to change</p>
                            </div>
                          ) : (
                            <div className="space-y-2 py-4">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Click to upload profile picture</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                            </div>
                          )}
                          <input
                            ref={profileAvatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfileAvatarUpload}
                            className="hidden"
                            data-testid="input-profile-avatar"
                          />
                        </div>
                        {profileAvatar && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClearProfileAvatar}
                            className="w-full"
                            data-testid="button-clear-profile-avatar"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Clear Picture
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/auth/me', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  name: profileName,
                                  phone: profilePhone,
                                  avatar: profileAvatar,
                                }),
                              });
                              if (response.ok) {
                                localStorage.setItem('profileName', profileName);
                                localStorage.setItem('profilePhone', profilePhone);
                                localStorage.setItem('profileAvatar', profileAvatar);
                                setIsEditingProfile(false);
                                toast({ title: 'Profile Updated', description: 'Your profile has been saved successfully.' });
                                window.location.reload();
                              } else {
                                toast({ title: 'Error', description: 'Failed to update profile' });
                              }
                            } catch (error) {
                              toast({ title: 'Error', description: 'Failed to update profile' });
                            }
                          }}
                          data-testid="button-save-profile"
                        >
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)} data-testid="button-cancel-profile">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profileAvatarPreview && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Profile Picture</p>
                          <img src={profileAvatarPreview} alt="Profile" className="h-24 w-24 rounded-lg object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="text-base font-medium">{profileName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-base font-medium">{profileEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-base font-medium">{profilePhone}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Change Password</CardTitle>
                      <CardDescription>Update your account password</CardDescription>
                    </div>
                    {!showChangePassword && (
                      <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)} data-testid="button-change-password-trigger">
                        Change Password
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {showChangePassword && (
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <FormLabel htmlFor="current-pwd">Current Password</FormLabel>
                      <div className="relative">
                        <Input
                          id="current-pwd"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          data-testid="input-current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          data-testid="button-toggle-current-password"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <FormLabel htmlFor="new-pwd">New Password</FormLabel>
                      <div className="relative">
                        <Input
                          id="new-pwd"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          data-testid="input-new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          data-testid="button-toggle-new-password"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <FormLabel htmlFor="confirm-pwd">Confirm Password</FormLabel>
                      <div className="relative">
                        <Input
                          id="confirm-pwd"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          data-testid="input-confirm-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          data-testid="button-toggle-confirm-password"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={async () => {
                          if (newPassword !== confirmPassword) {
                            toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
                            return;
                          }
                          if (newPassword.length < 6) {
                            toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
                            return;
                          }
                          try {
                            const response = await fetch('/api/auth/change-password', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                currentPassword,
                                newPassword,
                              }),
                            });
                            if (response.ok) {
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmPassword('');
                              setShowChangePassword(false);
                              toast({ title: 'Success', description: 'Password has been changed successfully.' });
                            } else {
                              const error = await response.json();
                              toast({ title: 'Error', description: error.message || 'Failed to change password', variant: 'destructive' });
                            }
                          } catch (error) {
                            toast({ title: 'Error', description: 'Failed to change password', variant: 'destructive' });
                          }
                        }}
                        data-testid="button-save-password"
                      >
                        Update Password
                      </Button>
                      <Button variant="outline" onClick={() => { setShowChangePassword(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }} data-testid="button-cancel-password">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">General Settings</CardTitle>
                  <CardDescription>Configure language, timezone, and appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Language Section */}
                  <FormField control={form.control} name="defaultLanguage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-settings-language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="tr">Turkish</SelectItem>
                          <SelectItem value="fa">Persian</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the primary language for the application</FormDescription>
                    </FormItem>
                  )} />

                  {/* Timezone Section */}
                  <div className="space-y-2">
                    <FormLabel htmlFor="timezone">Timezone</FormLabel>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone" data-testid="select-timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>All times in the panels will be displayed in this timezone</FormDescription>
                  </div>

                  {/* Primary Color Section */}
                  <FormField control={form.control} name="primaryColor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-14 h-9 p-1" data-testid="input-settings-color" />
                          <Input {...field} placeholder="#0079F2" className="flex-1" />
                        </div>
                      </FormControl>
                      <FormDescription>Used for buttons, links, and accents throughout the application</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Favicon Section */}
                  <div className="space-y-2">
                    <FormLabel htmlFor="favicon">Favicon</FormLabel>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      {faviconPreview ? (
                        <div className="space-y-2">
                          <img src={faviconPreview} alt="Favicon Preview" className="h-16 w-16 mx-auto rounded" />
                          <p className="text-sm text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2 py-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload favicon</p>
                          <p className="text-xs text-muted-foreground">PNG, ICO up to 1MB</p>
                        </div>
                      )}
                      <input
                        ref={faviconInputRef}
                        type="file"
                        accept="image/png,image/x-icon,.ico"
                        onChange={handleFaviconUpload}
                        className="hidden"
                        data-testid="input-favicon"
                      />
                    </div>
                    {favicon && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearFavicon}
                        className="w-full"
                        data-testid="button-clear-favicon"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Favicon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Restaurant Tab */}
            <TabsContent value="restaurant" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Restaurant Information</CardTitle>
                  <CardDescription>Manage your restaurant details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="rest-logo">Restaurant Logo</FormLabel>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {restaurantLogoPreview ? (
                        <div className="space-y-2">
                          <img src={restaurantLogoPreview} alt="Logo" className="max-h-24 mx-auto rounded-lg object-cover" />
                          <p className="text-sm text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2 py-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload logo</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        data-testid="input-restaurant-logo"
                      />
                    </div>
                    {restaurantLogo && (
                      <Button type="button" variant="outline" size="sm" onClick={handleClearLogo} className="w-full" data-testid="button-clear-logo">
                        <X className="h-4 w-4 mr-2" />
                        Clear Logo
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="rest-name">Restaurant Name</FormLabel>
                    <Input
                      id="rest-name"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder="Enter restaurant name"
                      data-testid="input-restaurant-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="rest-desc">Description</FormLabel>
                    <Textarea
                      id="rest-desc"
                      value={restaurantDescription}
                      onChange={(e) => setRestaurantDescription(e.target.value)}
                      placeholder="Describe your restaurant"
                      className="resize-none"
                      data-testid="textarea-restaurant-description"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="rest-address">Address</FormLabel>
                    <Input
                      id="rest-address"
                      value={restaurantAddress}
                      onChange={(e) => setRestaurantAddress(e.target.value)}
                      placeholder="Street address"
                      data-testid="input-restaurant-address"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="rest-phone">Phone</FormLabel>
                    <Input
                      id="rest-phone"
                      value={restaurantPhone}
                      onChange={(e) => setRestaurantPhone(e.target.value)}
                      placeholder="Contact phone number"
                      data-testid="input-restaurant-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="rest-email">Email</FormLabel>
                    <Input
                      id="rest-email"
                      type="email"
                      value={restaurantEmail}
                      onChange={(e) => setRestaurantEmail(e.target.value)}
                      placeholder="Contact email"
                      data-testid="input-restaurant-email"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Operating Hours</CardTitle>
                  <CardDescription>Set your restaurant hours for each day</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(operatingHours).map(([day, hoursData]: [string, any]) => (
                    <div key={day} className="flex items-end gap-3">
                      <div className="flex-1 min-w-24">
                        <FormLabel className="text-sm">{day}</FormLabel>
                      </div>
                      <div className="flex gap-2 items-end">
                        <div>
                          <FormLabel className="text-xs text-muted-foreground">Start</FormLabel>
                          <Input
                            type="time"
                            step="60"
                            value={hoursData.start}
                            onChange={(e) => setOperatingHours({ ...operatingHours, [day]: { ...hoursData, start: e.target.value } })}
                            className="w-32"
                            disabled={hoursData.closed}
                            data-testid={`input-hours-start-${day.toLowerCase()}`}
                          />
                        </div>
                        <div>
                          <FormLabel className="text-xs text-muted-foreground">End</FormLabel>
                          <Input
                            type="time"
                            step="60"
                            value={hoursData.end}
                            onChange={(e) => setOperatingHours({ ...operatingHours, [day]: { ...hoursData, end: e.target.value } })}
                            className="w-32"
                            disabled={hoursData.closed}
                            data-testid={`input-hours-end-${day.toLowerCase()}`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={hoursData.closed}
                            onCheckedChange={(checked) => setOperatingHours({ ...operatingHours, [day]: { ...hoursData, closed: checked as boolean } })}
                            data-testid={`checkbox-closed-${day.toLowerCase()}`}
                          />
                          <FormLabel className="text-xs text-muted-foreground">Closed</FormLabel>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Media</CardTitle>
                  <CardDescription>Add your social media links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="social-instagram">Instagram</FormLabel>
                    <Input
                      id="social-instagram"
                      value={socialMedia.instagram}
                      onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                      placeholder="https://instagram.com/yourprofile"
                      data-testid="input-social-instagram"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="social-whatsapp">WhatsApp</FormLabel>
                    <Input
                      id="social-whatsapp"
                      value={socialMedia.whatsapp}
                      onChange={(e) => setSocialMedia({ ...socialMedia, whatsapp: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      data-testid="input-social-whatsapp"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="social-telegram">Telegram</FormLabel>
                    <Input
                      id="social-telegram"
                      value={socialMedia.telegram}
                      onChange={(e) => setSocialMedia({ ...socialMedia, telegram: e.target.value })}
                      placeholder="@yourprofile"
                      data-testid="input-social-telegram"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Google Maps</CardTitle>
                  <CardDescription>Add your Google Maps location link</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="google-maps">Google Maps URL</FormLabel>
                    <Input
                      id="google-maps"
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/maps?q=..."
                      data-testid="input-google-maps-url"
                    />
                    <FormDescription>Paste your Google Maps embed or share link</FormDescription>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Login Screen Tab */}
            <TabsContent value="login" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Background Image</CardTitle>
                  <CardDescription>Customize the login page background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Background Image</FormLabel>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {loginBackgroundPreview ? (
                        <div className="space-y-2">
                          <img src={loginBackgroundPreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                          <p className="text-sm text-muted-foreground">Click to change or scroll down to clear</p>
                        </div>
                      ) : (
                        <div className="space-y-2 py-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        data-testid="input-login-background"
                      />
                    </div>
                    {loginBackgroundImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearImage}
                        className="w-full"
                        data-testid="button-clear-background"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Image
                      </Button>
                    )}
                    <FormDescription>Recommended size: 1920x1080px or larger. The image will be used as a background with a dark overlay for better text visibility.</FormDescription>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Page Tab */}
            <TabsContent value="qr" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">QR Landing Page</CardTitle>
                  <CardDescription>Customize what customers see when they scan a QR code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Content Settings */}
                  <div className="space-y-4 pb-6 border-b">
                    <h3 className="font-semibold text-sm">Page Content</h3>
                    <div className="space-y-2">
                      <FormLabel htmlFor="qr-title">Page Title</FormLabel>
                      <Input
                        id="qr-title"
                        value={qrPageTitle}
                        onChange={(e) => setQrPageTitle(e.target.value)}
                        placeholder="Scan to Order"
                        disabled={!showQrTitle}
                        data-testid="input-qr-page-title"
                      />
                      <FormDescription>Main heading displayed on the QR landing page</FormDescription>
                    </div>
                    <div className="space-y-2">
                      <FormLabel htmlFor="qr-description">Page Description</FormLabel>
                      <Input
                        id="qr-description"
                        value={qrPageDescription}
                        onChange={(e) => setQrPageDescription(e.target.value)}
                        placeholder="Welcome to our restaurant. Browse our menu and place your order."
                        disabled={!showQrDescription}
                        data-testid="input-qr-page-description"
                      />
                      <FormDescription>Subtitle or description shown below the title (optional)</FormDescription>
                    </div>
                  </div>

                  {/* Display Toggles */}
                  <div className="space-y-4 pb-6 border-b">
                    <h3 className="font-semibold text-sm">Display Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <FormLabel className="text-base mb-1">Show Title</FormLabel>
                          <FormDescription>Display the page title</FormDescription>
                        </div>
                        <Switch
                          checked={showQrTitle}
                          onCheckedChange={setShowQrTitle}
                          data-testid="switch-show-qr-title"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <FormLabel className="text-base mb-1">Show Description</FormLabel>
                          <FormDescription>Display the page description</FormDescription>
                        </div>
                        <Switch
                          checked={showQrDescription}
                          onCheckedChange={setShowQrDescription}
                          data-testid="switch-show-qr-description"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <FormLabel className="text-base mb-1">Show Call Waiter Button</FormLabel>
                          <FormDescription>Display the call waiter button</FormDescription>
                        </div>
                        <Switch
                          checked={showCallWaiter}
                          onCheckedChange={setShowCallWaiter}
                          data-testid="switch-show-call-waiter"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <FormLabel className="text-base mb-1">Show Address & Phone</FormLabel>
                          <FormDescription>Display restaurant address and phone number</FormDescription>
                        </div>
                        <Switch
                          checked={showAddressPhone}
                          onCheckedChange={setShowAddressPhone}
                          data-testid="switch-show-address-phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Styling</h3>
                    <div className="space-y-2">
                      <FormLabel htmlFor="qr-text-color">Text Color</FormLabel>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="qr-text-color"
                          type="color"
                          value={qrTextColor}
                          onChange={(e) => setQrTextColor(e.target.value)}
                          className="w-16 h-10 cursor-pointer"
                          data-testid="input-qr-text-color"
                        />
                        <span className="text-sm text-muted-foreground font-mono">{qrTextColor}</span>
                      </div>
                      <FormDescription>Color for all text on the QR landing page</FormDescription>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Menu Page Tab */}
            <TabsContent value="menu" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Menu Display Settings</CardTitle>
                  <CardDescription>Configure how the menu page appears to customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="menuTitle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Menu Page Title</FormLabel>
                      <FormControl><Input {...field} placeholder="Our Menu" data-testid="input-settings-title" /></FormControl>
                      <FormDescription>Displayed at the top of the menu page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Display Options</CardTitle>
                  <CardDescription>Control what information is shown to customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="showPrices" render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Show Prices</FormLabel>
                        <FormDescription>Display prices on menu items</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-settings-prices" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="showImages" render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Show Images</FormLabel>
                        <FormDescription>Display item images on the menu</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-settings-images" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="showMaterials" render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Show Ingredients</FormLabel>
                        <FormDescription>Display ingredient tags on items</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-settings-materials" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="showTypes" render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Show Food Types</FormLabel>
                        <FormDescription>Display dietary tags like vegan, spicy</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-settings-types" />
                      </FormControl>
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Kitchen Display Tab */}
            <TabsContent value="kd" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kitchen Display System</CardTitle>
                  <CardDescription>Configure your kitchen display settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Kitchen Display System settings coming soon. This feature will allow you to customize your KD display, manage order priorities, and set up kitchen workflows.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Currency Tab */}
            <TabsContent value="currency" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Currency Settings</CardTitle>
                  <CardDescription>Set the currency for all prices displayed throughout the site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="currency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Currency</FormLabel>
                      <Select onValueChange={handleCurrencyChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              {curr.name} ({curr.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the currency for your restaurant's prices</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="currencySymbol" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Symbol</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="$" maxLength={3} data-testid="input-currency-symbol" />
                      </FormControl>
                      <FormDescription>The symbol displayed next to prices (automatically set when changing currency)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Current Currency:</p>
                    <p className="text-2xl font-bold">
                      {form.watch('currencySymbol')} (
                      {currencies.find((c) => c.code === form.watch('currency'))?.name || 'Unknown'}
                      )
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">All prices will be displayed with this currency symbol throughout your site.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Payment Methods</CardTitle>
                  <CardDescription>Configure payment options for your customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash Only</SelectItem>
                          <SelectItem value="card">Card Only</SelectItem>
                          <SelectItem value="both">Cash & Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose which payment methods customers can use</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Role-Based Access Control</CardTitle>
                  <CardDescription>Define which admin sections each role can access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(['admin', 'manager', 'chef', 'accountant'] as const).map((role) => (
                    <div key={role} className="space-y-3 pb-6 border-b last:border-0">
                      <h3 className="font-semibold capitalize text-sm">{role} Permissions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {adminSections.map((section) => (
                          <div key={section} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${role}-${section}`}
                              checked={rolePermissions[role].includes(section)}
                              onCheckedChange={() => toggleRoleSection(role, section)}
                              data-testid={`checkbox-role-${role}-${section}`}
                            />
                            <label htmlFor={`${role}-${section}`} className="text-sm cursor-pointer">
                              {section}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* License Tab */}
            <TabsContent value="license" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />License Information</CardTitle>
                  <CardDescription>Manage your restaurant management system license</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="licenseKey" render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your license key" data-testid="input-license-key" />
                      </FormControl>
                      <FormDescription>Your unique license key for this installation</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="licenseExpiry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Expiry Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" data-testid="input-license-expiry" />
                      </FormControl>
                      <FormDescription>When your license will expire</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {form.watch('licenseExpiry') && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">License Expiry: {new Date(form.watch('licenseExpiry')!).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">Keep your license active to continue using all premium features.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Code Tab */}
            <TabsContent value="qrcode" className="space-y-6 animate-in fade-in duration-300">
              <QRCodeDesigner />
            </TabsContent>

            {/* Order Status Screen Tab */}
            <TabsContent value="oss" className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Screen Settings</CardTitle>
                  <CardDescription>Customize the appearance and display of the order status screen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Status Colors */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Order Status Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="pending-color">Pending Order Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="pending-color"
                            type="color"
                            value={ossForm.pendingColor}
                            onChange={(e) => setOSSForm({ ...ossForm, pendingColor: e.target.value })}
                            className="w-16 h-10 cursor-pointer"
                            data-testid="input-pending-color"
                          />
                          <span className="text-sm text-muted-foreground font-mono">{ossForm.pendingColor}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="preparing-color">Preparing Order Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="preparing-color"
                            type="color"
                            value={ossForm.preparingColor}
                            onChange={(e) => setOSSForm({ ...ossForm, preparingColor: e.target.value })}
                            className="w-16 h-10 cursor-pointer"
                            data-testid="input-preparing-color"
                          />
                          <span className="text-sm text-muted-foreground font-mono">{ossForm.preparingColor}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="ready-color">Ready Order Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="ready-color"
                            type="color"
                            value={ossForm.readyColor}
                            onChange={(e) => setOSSForm({ ...ossForm, readyColor: e.target.value })}
                            className="w-16 h-10 cursor-pointer"
                            data-testid="input-ready-color"
                          />
                          <span className="text-sm text-muted-foreground font-mono">{ossForm.readyColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background Settings */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-sm">Background</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="bg-solid"
                            name="background-type"
                            value="solid"
                            checked={ossForm.backgroundType === 'solid'}
                            onChange={(e) => setOSSForm({ ...ossForm, backgroundType: 'solid' as const })}
                            className="cursor-pointer"
                            data-testid="radio-bg-solid"
                          />
                          <label htmlFor="bg-solid" className="cursor-pointer text-sm">
                            Solid Color
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="bg-image"
                            name="background-type"
                            value="image"
                            checked={ossForm.backgroundType === 'image'}
                            onChange={(e) => setOSSForm({ ...ossForm, backgroundType: 'image' as const })}
                            className="cursor-pointer"
                            data-testid="radio-bg-image"
                          />
                          <label htmlFor="bg-image" className="cursor-pointer text-sm">
                            Image
                          </label>
                        </div>
                      </div>

                      {ossForm.backgroundType === 'solid' && (
                        <div className="space-y-2 p-3 bg-muted rounded-lg">
                          <FormLabel htmlFor="bg-color">Background Color</FormLabel>
                          <div className="flex gap-2 items-center">
                            <Input
                              id="bg-color"
                              type="color"
                              value={ossForm.backgroundColor}
                              onChange={(e) => setOSSForm({ ...ossForm, backgroundColor: e.target.value })}
                              className="w-16 h-10 cursor-pointer"
                              data-testid="input-bg-color"
                            />
                            <span className="text-sm text-muted-foreground font-mono">{ossForm.backgroundColor}</span>
                          </div>
                        </div>
                      )}

                      {ossForm.backgroundType === 'image' && (
                        <div className="space-y-2 p-3 bg-muted rounded-lg">
                          <FormLabel htmlFor="bg-image">Upload Image</FormLabel>
                          <Input
                            id="bg-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const imageData = event.target?.result as string;
                                  setOSSForm({ ...ossForm, backgroundImage: imageData });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            data-testid="input-bg-image"
                          />
                          {ossForm.backgroundImage && (
                            <div className="mt-2">
                              <img
                                src={ossForm.backgroundImage}
                                alt="Background preview"
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text and Border Colors */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-sm">Card Styling</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="text-color">Text Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="text-color"
                            type="color"
                            value={ossForm.textColor}
                            onChange={(e) => setOSSForm({ ...ossForm, textColor: e.target.value })}
                            className="w-16 h-10 cursor-pointer"
                            data-testid="input-text-color"
                          />
                          <span className="text-sm text-muted-foreground font-mono">{ossForm.textColor}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="border-color">Border Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="border-color"
                            type="color"
                            value={ossForm.borderColor}
                            onChange={(e) => setOSSForm({ ...ossForm, borderColor: e.target.value })}
                            className="w-16 h-10 cursor-pointer"
                            data-testid="input-border-color"
                          />
                          <span className="text-sm text-muted-foreground font-mono">{ossForm.borderColor}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="box-style">Box Style</FormLabel>
                        <Select value={ossForm.boxStyle} onValueChange={(value) => setOSSForm({ ...ossForm, boxStyle: value as any })}>
                          <SelectTrigger data-testid="select-box-style">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rounded">Rounded Rectangle</SelectItem>
                            <SelectItem value="glass">Glass Rectangle</SelectItem>
                            <SelectItem value="neon">Neon Rectangle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Labels and Toggles */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-sm">Labels and Display</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="header-text">Header Text</FormLabel>
                        <Input
                          id="header-text"
                          value={ossForm.headerText}
                          onChange={(e) => setOSSForm({ ...ossForm, headerText: e.target.value })}
                          placeholder="e.g., Order Status, Kitchen Display"
                          data-testid="input-header-text"
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="number-label">Number Label</FormLabel>
                        <Input
                          id="number-label"
                          value={ossForm.numberLabel}
                          onChange={(e) => setOSSForm({ ...ossForm, numberLabel: e.target.value })}
                          placeholder="e.g., Number, Order #"
                          data-testid="input-number-label"
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="table-label">Table Label</FormLabel>
                        <Input
                          id="table-label"
                          value={ossForm.tableLabel}
                          onChange={(e) => setOSSForm({ ...ossForm, tableLabel: e.target.value })}
                          placeholder="e.g., Table, Seat"
                          data-testid="input-table-label"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <FormLabel className="text-base mb-1">Show Table Information</FormLabel>
                          <FormDescription>Display table number on order cards</FormDescription>
                        </div>
                        <Switch
                          checked={ossForm.showTableInfo}
                          onCheckedChange={(checked) => setOSSForm({ ...ossForm, showTableInfo: checked })}
                          data-testid="switch-show-table-info"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <FormLabel className="text-base mb-1">Show Status Icon</FormLabel>
                          <FormDescription>Display status icon (clock, flame, checkmark)</FormDescription>
                        </div>
                        <Switch
                          checked={ossForm.showIcon}
                          onCheckedChange={(checked) => setOSSForm({ ...ossForm, showIcon: checked })}
                          data-testid="switch-show-icon"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <FormLabel className="text-base mb-1">Limit to 3 Active Orders</FormLabel>
                          <FormDescription>Show only the 3 most recent active orders</FormDescription>
                        </div>
                        <Switch
                          checked={ossForm.limitTo3Orders}
                          onCheckedChange={(checked) => setOSSForm({ ...ossForm, limitTo3Orders: checked })}
                          data-testid="switch-limit-3-orders"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      updateOSSSettings(ossForm);
                      toast({ title: 'Settings Saved', description: 'Order Status Screen settings have been updated.' });
                    }}
                    data-testid="button-save-oss-settings"
                  >
                    Save OSS Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateSettingsMutation.isPending} data-testid="button-save-settings">
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
