import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X, Lock, CreditCard, FileText } from 'lucide-react';
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
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('appSettings');
    return stored ? JSON.parse(stored) : mockSettings;
  });
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const languages = mockLanguages.filter((l) => l.isActive);

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
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1">
              <TabsTrigger value="general" className="text-xs md:text-sm">General</TabsTrigger>
              <TabsTrigger value="login" className="text-xs md:text-sm">Login</TabsTrigger>
              <TabsTrigger value="qr" className="text-xs md:text-sm">QR Page</TabsTrigger>
              <TabsTrigger value="menu" className="text-xs md:text-sm">Menu</TabsTrigger>
              <TabsTrigger value="currency" className="text-xs md:text-sm">Currency</TabsTrigger>
              <TabsTrigger value="payment" className="text-xs md:text-sm">Payment</TabsTrigger>
              <TabsTrigger value="roles" className="text-xs md:text-sm">Roles</TabsTrigger>
              <TabsTrigger value="license" className="text-xs md:text-sm">License</TabsTrigger>
            </TabsList>

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
