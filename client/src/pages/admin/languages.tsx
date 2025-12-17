import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '@/components/admin/DataTable';
import { useToast } from '@/hooks/use-toast';
import { mockLanguages } from '@/lib/mockData';
import type { AppLanguage } from '@/lib/types';

const languageSchema = z.object({
  code: z.string().min(2, 'Language code is required').max(5),
  name: z.string().min(1, 'Name is required'),
  nativeName: z.string().min(1, 'Native name is required'),
  direction: z.enum(['ltr', 'rtl']),
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

  const form = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: { code: '', name: '', nativeName: '', direction: 'ltr', isActive: true, isDefault: false },
  });

  const openCreate = () => {
    form.reset({ code: '', name: '', nativeName: '', direction: 'ltr', isActive: true, isDefault: false });
    setFormOpen(true);
  };

  const openEdit = (lang: AppLanguage) => {
    form.reset({ code: lang.code, name: lang.name, nativeName: lang.nativeName, direction: lang.direction, isActive: lang.isActive, isDefault: lang.isDefault });
    setEditingLanguage(lang);
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
