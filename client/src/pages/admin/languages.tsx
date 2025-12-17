import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '@/components/admin/DataTable';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { mockLanguages } from '@/lib/mockData';
import type { AppLanguage } from '@/lib/types';
import { translations } from '@/lib/types';

const languageSchema = z.object({
  code: z.string().min(2, 'Language code is required').max(5),
  name: z.string().min(1, 'Name is required'),
  nativeName: z.string().min(1, 'Native name is required'),
  direction: z.enum(['ltr', 'rtl']),
  flagImage: z.string().optional(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type LanguageFormData = z.infer<typeof languageSchema>;

export default function LanguagesPage() {
  const { toast } = useToast();
  const [languages, setLanguages] = useState<AppLanguage[]>(mockLanguages);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<AppLanguage | null>(null);
  const [deleteLanguage, setDeleteLanguage] = useState<AppLanguage | null>(null);
  const [textEditorOpen, setTextEditorOpen] = useState(false);
  const [editingTexts, setEditingTexts] = useState<AppLanguage | null>(null);
  const [textOverrides, setTextOverrides] = useState<Record<string, string>>({});

  const form = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: { code: '', name: '', nativeName: '', direction: 'ltr', flagImage: '', isActive: true, isDefault: false },
  });

  const openCreate = () => {
    form.reset({ code: '', name: '', nativeName: '', direction: 'ltr', flagImage: '', isActive: true, isDefault: false });
    setFormOpen(true);
  };

  const openEdit = (lang: AppLanguage) => {
    form.reset({ 
      code: lang.code, 
      name: lang.name, 
      nativeName: lang.nativeName, 
      direction: lang.direction, 
      flagImage: lang.flagImage || '',
      isActive: lang.isActive, 
      isDefault: lang.isDefault 
    });
    setEditingLanguage(lang);
  };

  const openTextEditor = (lang: AppLanguage) => {
    setEditingTexts(lang);
    const englishTexts = translations.en;
    const langTexts = translations[lang.code as keyof typeof translations] || {};
    const overrides: Record<string, string> = {};
    
    Object.keys(englishTexts).forEach(key => {
      overrides[key] = lang.textOverrides?.[key] || langTexts[key] || englishTexts[key];
    });
    
    setTextOverrides(overrides);
    setTextEditorOpen(true);
  };

  const handleCreate = (data: LanguageFormData) => {
    let updatedLanguages = [...languages];
    if (data.isDefault) {
      updatedLanguages = updatedLanguages.map((l) => ({ ...l, isDefault: false }));
    }
    const newLang: AppLanguage = { id: String(Date.now()), ...data };
    setLanguages([...updatedLanguages, newLang]);
    setFormOpen(false);
    form.reset();
    toast({ title: 'Language Added' });
  };

  const handleEdit = (data: LanguageFormData) => {
    if (!editingLanguage) return;
    let updatedLanguages = languages.map((l) => {
      if (l.id === editingLanguage.id) return { ...l, ...data };
      if (data.isDefault) return { ...l, isDefault: false };
      return l;
    });
    setLanguages(updatedLanguages);
    setEditingLanguage(null);
    form.reset();
    toast({ title: 'Language Updated' });
  };

  const handleSaveTexts = () => {
    if (!editingTexts) return;
    setLanguages(languages.map((l) => {
      if (l.id === editingTexts.id) {
        return { ...l, textOverrides };
      }
      return l;
    }));
    setTextEditorOpen(false);
    setEditingTexts(null);
    toast({ title: 'Text translations saved' });
  };

  const handleDelete = () => {
    if (!deleteLanguage) return;
    if (deleteLanguage.isDefault) {
      toast({ title: 'Cannot delete default language', variant: 'destructive' });
      setDeleteLanguage(null);
      return;
    }
    setLanguages(languages.filter((l) => l.id !== deleteLanguage.id));
    setDeleteLanguage(null);
    toast({ title: 'Language Deleted' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Languages</h1>
          <p className="text-muted-foreground">Configure available menu languages</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-language">
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      <DataTable
        data={languages}
        columns={[
          { 
            key: 'flag', 
            header: 'Flag', 
            render: (item) => item.flagImage ? (
              <img src={item.flagImage} alt={item.name} className="w-8 h-5 object-cover rounded-sm" />
            ) : (
              <div className="w-8 h-5 rounded-sm bg-muted flex items-center justify-center text-xs">{item.code.toUpperCase()}</div>
            )
          },
          { key: 'code', header: 'Code' },
          { key: 'name', header: 'Name' },
          { key: 'nativeName', header: 'Native Name' },
          { key: 'direction', header: 'Direction', render: (item) => item.direction.toUpperCase() },
          {
            key: 'isDefault',
            header: 'Default',
            render: (item) => item.isDefault ? <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> : null,
          },
          {
            key: 'isActive',
            header: 'Status',
            render: (item) => (
              <Badge variant={item.isActive ? 'default' : 'secondary'} className="no-default-active-elevate">
                {item.isActive ? 'Active' : 'Inactive'}
              </Badge>
            ),
          },
        ]}
        onEdit={openEdit}
        onDelete={(item) => setDeleteLanguage(item)}
        testIdPrefix="language"
        customActions={(item) => (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => openTextEditor(item)}
            title="Edit Texts"
            data-testid={`button-edit-texts-${item.id}`}
          >
            <FileText className="h-4 w-4" />
          </Button>
        )}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent data-testid="modal-language-form">
          <DialogHeader>
            <DialogTitle>Add Language</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Code</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g., en, es, fr" data-testid="input-language-code" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., Spanish" data-testid="input-language-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nativeName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Native Name</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., Español" data-testid="input-language-native" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="flagImage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Flag Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Upload flag or enter URL"
                      testId="input-language-flag"
                    />
                  </FormControl>
                  <FormDescription>Country flag for language selection</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="direction" render={({ field }) => (
                <FormItem>
                  <FormLabel>Text Direction</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-language-direction">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                      <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-6">
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-language-active" />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isDefault" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">Default</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-language-default" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-language">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingLanguage} onOpenChange={() => setEditingLanguage(null)}>
        <DialogContent data-testid="modal-language-edit">
          <DialogHeader>
            <DialogTitle>Edit Language</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Code</FormLabel>
                  <FormControl><Input {...field} data-testid="input-language-code-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl><Input {...field} data-testid="input-language-name-edit" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nativeName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Native Name</FormLabel>
                    <FormControl><Input {...field} data-testid="input-language-native-edit" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="flagImage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Flag Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Upload flag or enter URL"
                      testId="input-language-flag-edit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="direction" render={({ field }) => (
                <FormItem>
                  <FormLabel>Text Direction</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-language-direction-edit">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                      <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-6">
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-language-active-edit" />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isDefault" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">Default</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-language-default-edit" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingLanguage(null)}>Cancel</Button>
                <Button type="submit" data-testid="button-update-language">Update</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={textEditorOpen} onOpenChange={setTextEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-text-editor">
          <DialogHeader>
            <DialogTitle>Edit Texts - {editingTexts?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Customize the UI text for this language. Leave empty to use the default translation.
            </p>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {Object.entries(translations.en).map(([key, englishValue]) => (
                <div key={key} className="grid grid-cols-2 gap-3 items-start">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">{key}</label>
                    <p className="text-sm text-muted-foreground">{englishValue}</p>
                  </div>
                  <Input
                    value={textOverrides[key] || ''}
                    onChange={(e) => setTextOverrides({ ...textOverrides, [key]: e.target.value })}
                    placeholder={englishValue}
                    data-testid={`input-text-${key}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setTextEditorOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveTexts} data-testid="button-save-texts">Save Texts</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteLanguage} onOpenChange={() => setDeleteLanguage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Language</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteLanguage?.name}"? This will remove all translations for this language.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-language">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
