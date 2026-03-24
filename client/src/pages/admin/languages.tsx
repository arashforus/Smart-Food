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
import { useQuery, useMutation } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { AppLanguage } from '@/lib/types';
import { Loader2 } from 'lucide-react';

import { useLanguage } from '@/hooks/use-language';

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
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<AppLanguage | null>(null);
  const [deleteLanguage, setDeleteLanguage] = useState<AppLanguage | null>(null);
  const [textEditorOpen, setTextEditorOpen] = useState(false);
  const [editingTexts, setEditingTexts] = useState<AppLanguage | null>(null);
  const [textOverrides, setTextOverrides] = useState<Record<string, string>>({});
  const { setLanguage, setAdminLanguage } = useLanguage();

  const form = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: { code: '', name: '', nativeName: '', direction: 'ltr', flagImage: '', isActive: true, isDefault: false },
  });

  const { data: languages = [], isLoading } = useQuery<AppLanguage[]>({
    queryKey: ['/api/languages'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: LanguageFormData) => {
      return apiRequest('POST', '/api/languages', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      setFormOpen(false);
      form.reset();
      toast({ title: t('language_added') });
      // Refresh language contexts
      setLanguage(localStorage.getItem('language') || 'en');
      setAdminLanguage(localStorage.getItem('adminLanguage') || 'en');
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_add_language'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: LanguageFormData) => {
      if (!editingLanguage) throw new Error('No language selected');
      return apiRequest('PATCH', `/api/languages/${editingLanguage.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      setEditingLanguage(null);
      form.reset();
      toast({ title: t('language_updated') });
      // Refresh language contexts
      setLanguage(localStorage.getItem('language') || 'en');
      setAdminLanguage(localStorage.getItem('adminLanguage') || 'en');
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_update_language'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/languages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      setDeleteLanguage(null);
      toast({ title: t('language_deleted') });
      // Refresh language contexts
      setLanguage(localStorage.getItem('language') || 'en');
      setAdminLanguage(localStorage.getItem('adminLanguage') || 'en');
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_delete_language'), variant: 'destructive' });
    },
  });

  const openCreate = () => {
    form.reset({ code: '', name: '', nativeName: '', direction: 'ltr', flagImage: '', isActive: true, isDefault: false });
    setFormOpen(true);
  };

  const openEdit = (lang: AppLanguage) => {
    form.reset({ 
      code: lang.code, 
      name: lang.name, 
      nativeName: lang.nativeName || '', 
      direction: (lang.direction || 'ltr') as 'ltr' | 'rtl', 
      flagImage: lang.flagImage || '',
      isActive: lang.isActive ?? true, 
      isDefault: lang.isDefault ?? false
    });
    setEditingLanguage(lang);
  };

  const openTextEditor = (lang: AppLanguage) => {
    setEditingTexts(lang);
    const overrides: Record<string, string> = { ...lang.textOverrides };
    setTextOverrides(overrides);
    setTextEditorOpen(true);
  };

  const handleCreate = (data: LanguageFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: LanguageFormData) => {
    updateMutation.mutate(data);
  };

  const handleSaveTexts = () => {
    setTextEditorOpen(false);
    setEditingTexts(null);
    toast({ title: t('text_translations_saved') });
  };

  const handleDelete = () => {
    if (!deleteLanguage) return;
    if (deleteLanguage.isDefault) {
      toast({ title: t('cannot_delete_default_language'), variant: 'destructive' });
      setDeleteLanguage(null);
      return;
    }
    deleteMutation.mutate(deleteLanguage.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{t('languages')}</h1>
          <p className="text-muted-foreground">{t('languages_desc')}</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-language">
          <Plus className="h-4 w-4 mr-2" />
          {t('add_language')}
        </Button>
      </div>

      <DataTable
        data={languages}
        columns={[
          { 
            key: 'flag', 
            header: t('flag'), 
            render: (item: any) => item.flagImage ? (
              <img src={item.flagImage} alt={item.name} className="w-8 h-5 object-cover rounded-sm" />
            ) : (
              <div className="w-8 h-5 rounded-sm bg-muted flex items-center justify-center text-xs">{item.code.toUpperCase()}</div>
            )
          },
          { key: 'code', header: t('code') },
          { key: 'name', header: t('name') },
          { key: 'nativeName', header: t('native_name'), render: (item: any) => item.nativeName || '-' },
          { key: 'direction', header: t('direction'), render: (item: any) => (item.direction ? item.direction.toUpperCase() : 'LTR') },
          {
            key: 'isDefault',
            header: t('default'),
            render: (item: any) => item.isDefault ? <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> : null,
          },
          {
            key: 'isActive',
            header: t('status'),
            render: (item: any) => (
              <Badge variant={item.isActive ? 'default' : 'secondary'} className="no-default-active-elevate">
                {item.isActive ? t('active') : t('inactive')}
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
            <DialogTitle>{t('add_language')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4" data-testid="form-language-create">
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('language_code')}</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g., en, es, fr" data-testid="input-language-code" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')} ({t('english')})</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., Spanish" data-testid="input-language-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nativeName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('native_name')}</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., Español" data-testid="input-language-native" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="flagImage" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('flag_image')}</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('upload_flag')}
                      testId="input-language-flag"
                    />
                  </FormControl>
                  <FormDescription>{t('flag_desc')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="direction" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('text_direction')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-language-direction">
                        <SelectValue placeholder={t('select_direction')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ltr">{t('ltr')}</SelectItem>
                      <SelectItem value="rtl">{t('rtl')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-6">
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">{t('active')}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-language-active" />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isDefault" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">{t('default')}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-language-default" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" data-testid="button-save-language" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('create')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingLanguage} onOpenChange={() => setEditingLanguage(null)}>
        <DialogContent data-testid="modal-language-edit">
          <DialogHeader>
            <DialogTitle>{t('edit_language')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('language_code')}</FormLabel>
                  <FormControl><Input {...field} data-testid="input-language-code-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')} ({t('english')})</FormLabel>
                    <FormControl><Input {...field} data-testid="input-language-name-edit" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nativeName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('native_name')}</FormLabel>
                    <FormControl><Input {...field} data-testid="input-language-native-edit" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="flagImage" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('flag_image')}</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('upload_flag')}
                      testId="input-language-flag-edit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="direction" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('text_direction')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-language-direction-edit">
                        <SelectValue placeholder={t('select_direction')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ltr">{t('ltr')}</SelectItem>
                      <SelectItem value="rtl">{t('rtl')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-6">
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">{t('active')}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-language-active-edit" />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isDefault" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">{t('default')}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-language-default-edit" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingLanguage(null)}>{t('cancel')}</Button>
                <Button type="submit" data-testid="button-update-language" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('update')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={textEditorOpen} onOpenChange={setTextEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-text-editor">
          <DialogHeader>
            <DialogTitle>{t('edit_texts')} - {editingTexts?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('edit_texts_desc')}
            </p>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {Object.entries(textOverrides).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-3 items-start">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">{key}</label>
                  </div>
                  <Input
                    value={value || ''}
                    onChange={(e) => setTextOverrides({ ...textOverrides, [key]: e.target.value })}
                    data-testid={`input-text-${key}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setTextEditorOpen(false)}>{t('cancel')}</Button>
              <Button onClick={handleSaveTexts} data-testid="button-save-texts">{t('save_texts')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteLanguage} onOpenChange={() => setDeleteLanguage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_language')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_language').replace('{name}', deleteLanguage?.name || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-language">{t('delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
