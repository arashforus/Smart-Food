import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X, Lock, CreditCard, FileText, Eye, EyeOff } from 'lucide-react';
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
import type { Settings } from '@/lib/types';
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

export default function SettingsPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  const { ossSettings, updateOSSSettings } = useOrders();
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('appSettings');
    return stored ? JSON.parse(stored) : mockSettings;
  });
  const [ossForm, setOSSForm] = useState<OSSSettings>(ossSettings);
  const [isPending, setIsPending] = useState(false);
  const [loginBackgroundImage, setLoginBackgroundImage] = useState<string>(() => {
    return localStorage.getItem('loginBackgroundImage') || '';
  });
  const [loginBackgroundPreview, setLoginBackgroundPreview] = useState<string>(loginBackgroundImage);
  const [qrPageTitle, setQrPageTitle] = useState(() => localStorage.getItem('qrPageTitle') || 'Scan to Order');
  const [qrPageDescription, setQrPageDescription] = useState(() => localStorage.getItem('qrPageDescription') || '');
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

  // Profile State
  const [profileName, setProfileName] = useState(() => localStorage.getItem('profileName') || 'John Admin');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('profileEmail') || 'admin@restaurant.com');
  const [profilePhone, setProfilePhone] = useState(() => localStorage.getItem('profilePhone') || '+1 (555) 123-4567');
  const [profileAvatar, setProfileAvatar] = useState(() => localStorage.getItem('profileAvatar') || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(() => location.includes('action=changePassword'));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const languages = mockLanguages.filter((l) => l.isActive);

  useEffect(() => {
    setShowChangePassword(location.includes('action=changePassword'));
  }, [location]);

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

  const handleSubmit = (data: SettingsFormData) => {
    setIsPending(true);
    setTimeout(() => {
      const updatedSettings = {
        ...settings,
        ...data,
        paymentSettings: { paymentMethod: data.paymentMethod },
        rolePermissions,
      };
      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      if (loginBackgroundImage) {
        localStorage.setItem('loginBackgroundImage', loginBackgroundImage);
      }
      localStorage.setItem('qrPageTitle', qrPageTitle);
      localStorage.setItem('qrPageDescription', qrPageDescription);
      localStorage.setItem('menuPageTitle', menuPageTitle);
      localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
      localStorage.setItem('restaurantName', restaurantName);
      localStorage.setItem('restaurantDescription', restaurantDescription);
      localStorage.setItem('restaurantAddress', restaurantAddress);
      localStorage.setItem('restaurantPhone', restaurantPhone);
      localStorage.setItem('restaurantEmail', restaurantEmail);
      localStorage.setItem('restaurantHours', restaurantHours);
      setSettings(updatedSettings);
      setIsPending(false);
      toast({ title: 'Settings Saved', description: 'All settings have been updated successfully.' });
    }, 500);
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

  const handleClearImage = () => {
    setLoginBackgroundImage('');
    setLoginBackgroundPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    localStorage.removeItem('loginBackgroundImage');
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
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-6 lg:grid-cols-12 gap-1">
              <TabsTrigger value="profile" className="text-xs md:text-sm">Profile</TabsTrigger>
              <TabsTrigger value="general" className="text-xs md:text-sm">General</TabsTrigger>
              <TabsTrigger value="restaurant" className="text-xs md:text-sm">Restaurant</TabsTrigger>
              <TabsTrigger value="login" className="text-xs md:text-sm">Login</TabsTrigger>
              <TabsTrigger value="qr" className="text-xs md:text-sm">QR Page</TabsTrigger>
              <TabsTrigger value="qrcode" className="text-xs md:text-sm">QR Design</TabsTrigger>
              <TabsTrigger value="menu" className="text-xs md:text-sm">Menu</TabsTrigger>
              <TabsTrigger value="currency" className="text-xs md:text-sm">Currency</TabsTrigger>
              <TabsTrigger value="payment" className="text-xs md:text-sm">Payment</TabsTrigger>
              <TabsTrigger value="roles" className="text-xs md:text-sm">Roles</TabsTrigger>
              <TabsTrigger value="license" className="text-xs md:text-sm">License</TabsTrigger>
              <TabsTrigger value="oss" className="text-xs md:text-sm">OSS</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
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
                          onChange={(e) => setProfileEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          data-testid="input-profile-email"
                        />
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
                        <FormLabel htmlFor="profile-avatar">Avatar URL</FormLabel>
                        <Input
                          id="profile-avatar"
                          value={profileAvatar}
                          onChange={(e) => setProfileAvatar(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          data-testid="input-profile-avatar"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => {
                            localStorage.setItem('profileName', profileName);
                            localStorage.setItem('profileEmail', profileEmail);
                            localStorage.setItem('profilePhone', profilePhone);
                            localStorage.setItem('profileAvatar', profileAvatar);
                            setIsEditingProfile(false);
                            toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
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
                    <div className="space-y-3">
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
                        onClick={() => {
                          if (newPassword !== confirmPassword) {
                            toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
                            return;
                          }
                          if (newPassword.length < 6) {
                            toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
                            return;
                          }
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setShowChangePassword(false);
                          toast({ title: 'Success', description: 'Password has been changed.' });
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
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appearance</CardTitle>
                  <CardDescription>Customize how your admin panel and menu look</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="primaryColor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-14 h-9 p-1" data-testid="input-settings-color" />
                          <Input {...field} placeholder="#0079F2" className="flex-1" />
                        </div>
                      </FormControl>
                      <FormDescription>Used for buttons, links, and accents throughout the site</FormDescription>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Language</CardTitle>
                  <CardDescription>Set default language for the menu</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField control={form.control} name="defaultLanguage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Language</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-settings-language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.nativeName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Language shown to customers by default</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Restaurant Tab */}
            <TabsContent value="restaurant" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Restaurant Information</CardTitle>
                  <CardDescription>Manage your restaurant details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Input
                      id="rest-desc"
                      value={restaurantDescription}
                      onChange={(e) => setRestaurantDescription(e.target.value)}
                      placeholder="Describe your restaurant"
                      data-testid="input-restaurant-description"
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
                  <div className="space-y-2">
                    <FormLabel htmlFor="rest-hours">Operating Hours</FormLabel>
                    <Input
                      id="rest-hours"
                      value={restaurantHours}
                      onChange={(e) => setRestaurantHours(e.target.value)}
                      placeholder="e.g., 9:00 AM - 10:00 PM"
                      data-testid="input-restaurant-hours"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Login Screen Tab */}
            <TabsContent value="login" className="space-y-6">
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
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="qr-title">Page Title</FormLabel>
                    <Input
                      id="qr-title"
                      value={qrPageTitle}
                      onChange={(e) => setQrPageTitle(e.target.value)}
                      placeholder="Scan to Order"
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
                      data-testid="input-qr-page-description"
                    />
                    <FormDescription>Subtitle or description shown below the title (optional)</FormDescription>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Menu Page Tab */}
            <TabsContent value="menu" className="space-y-6">
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
            </TabsContent>

            {/* Currency Tab */}
            <TabsContent value="currency" className="space-y-6">
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
            <TabsContent value="payment" className="space-y-6">
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
            <TabsContent value="roles" className="space-y-6">
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
            <TabsContent value="license" className="space-y-6">
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
            <TabsContent value="qrcode" className="space-y-6">
              <QRCodeDesigner />
            </TabsContent>

            {/* Order Status Screen Tab */}
            <TabsContent value="oss" className="space-y-6">
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

                  {/* Labels and Toggles */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-sm">Labels and Display</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Button type="submit" disabled={isPending} data-testid="button-save-settings">
              {isPending ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
