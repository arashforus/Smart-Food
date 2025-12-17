import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [isPending, setIsPending] = useState(false);
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
    },
  });

  const handleSubmit = (data: SettingsFormData) => {
    setIsPending(true);
    setTimeout(() => {
      setSettings({ ...settings, ...data });
      setIsPending(false);
      toast({ title: 'Settings Saved', description: 'Your settings have been updated.' });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Configure your admin panel and menu display</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>Customize how your menu looks</CardDescription>
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
                  <FormDescription>Used for buttons, links, and accents</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="menuTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Title</FormLabel>
                  <FormControl><Input {...field} data-testid="input-settings-title" /></FormControl>
                  <FormDescription>Displayed at the top of the QR menu</FormDescription>
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

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} data-testid="button-save-settings">
              {isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
