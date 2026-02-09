import { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
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
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Category } from '@/lib/types';

interface Language {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

interface StorageCategory {
  id: string;
  generalName: string;
  name: Record<string, string>;
  image: string | null;
  order: number;
  isActive: boolean;
}

const createCategorySchema = (languages: Language[]) => {
  const schema: Record<string, any> = {
    name: z.string().min(1, 'Name is required'),
    image: z.string().optional(),
    order: z.number().min(1, 'Order must be at least 1'),
    isActive: z.boolean().default(true),
  };

  languages.forEach((lang) => {
    if (lang.isActive) {
      schema[`name_${lang.code}`] = z.string().optional();
    }
  });

  return z.object(schema);
};

import { useLanguage } from '@/hooks/use-language';

export default function CategoriesPage() {
  const { t, adminDir } = useLanguage();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StorageCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<StorageCategory | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefEdit = useRef<HTMLInputElement>(null);

  const { data: languages = [], isLoading: languagesLoading } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  const categorySchema = createCategorySchema(languages);
  type CategoryFormData = z.infer<typeof categorySchema>;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: languages.reduce((acc, lang) => {
      if (lang.isActive) {
        acc[`name_${lang.code}`] = '';
      }
      return acc;
    }, { name: '', image: '', order: 1, isActive: true } as any),
  });

  const { data: categories = [], isLoading, refetch } = useQuery<StorageCategory[]>({
    queryKey: ['/api/categories'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        if (lang.isActive) {
          const langName = (data as any)[`name_${lang.code}`];
          nameObj[lang.code] = langName || '';
        }
      });
      return apiRequest('POST', '/api/categories', {
        generalName: (data as any).name || '',
        name: nameObj,
        image: data.image || null,
        order: data.order,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setFormOpen(false);
      form.reset();
      toast({ title: t('category_created') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_create_category'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      if (!editingCategory) throw new Error('No category selected');
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        if (lang.isActive) {
          const langName = (data as any)[`name_${lang.code}`];
          nameObj[lang.code] = langName || '';
        }
      });
      return apiRequest('PATCH', `/api/categories/${editingCategory.id}`, {
        generalName: (data as any).name || '',
        name: nameObj,
        image: data.image || null,
        order: data.order,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setEditingCategory(null);
      form.reset();
      toast({ title: t('category_updated') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_update_category'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setDeleteCategory(null);
      toast({ title: t('category_deleted') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_delete_category'), variant: 'destructive' });
    },
  });

  const openCreate = () => {
    const defaultValues: any = { 
      name: '',
      image: '', 
      order: (categories.length || 0) + 1, 
      isActive: true 
    };
    languages.forEach((lang) => {
      if (lang.isActive) {
        defaultValues[`name_${lang.code}`] = '';
      }
    });
    form.reset(defaultValues);
    setFormOpen(true);
  };

  const openEdit = (category: StorageCategory) => {
    const defaultValues: any = {
      name: category.generalName || '',
      image: category.image || '',
      order: parseInt(String(category.order), 10),
      isActive: category.isActive,
    };
    languages.forEach((lang) => {
      if (lang.isActive) {
        defaultValues[`name_${lang.code}`] = category.name[lang.code] || '';
      }
    });
    form.reset(defaultValues);
    setEditingCategory(category);
  };

  const handleCreate = (data: CategoryFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: CategoryFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (!deleteCategory) return;
    deleteMutation.mutate(deleteCategory.id);
  };

  const FormContent = useMemo(() => {
    return ({ onSubmit, onCancel, isCreate }: { onSubmit: (data: CategoryFormData) => void; onCancel: () => void; isCreate: boolean }) => (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">{t('info')}</TabsTrigger>
              <TabsTrigger value="translations">{t('translations')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 pt-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('category_name')}</FormLabel>
                  <FormControl><Input {...field} placeholder={t('category_name_placeholder')} data-testid={`input-category-name${isCreate ? '' : '-edit'}`} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('image')}</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <ImageUpload
                        value={field.value || ''}
                        onChange={(url) => field.onChange(url)}
                        placeholder={t('upload_category_image')}
                        testId="input-category-image"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="order" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('display_order')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      value={field.value ? String(field.value) : ''} 
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        field.onChange(val ? parseInt(val, 10) : 1);
                      }}
                      data-testid={`input-category-order${isCreate ? '' : '-edit'}`} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {!isCreate && (
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>{t('active')}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-category-active-edit" />
                    </FormControl>
                  </FormItem>
                )} />
              )}
            </TabsContent>
            
            <TabsContent value="translations" className="space-y-4 pt-4">
              {languages.map((lang) => lang.isActive && (
                <FormField key={lang.code} control={form.control} name={`name_${lang.code}`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')} ({lang.name})</FormLabel>
                    <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-category-name-${lang.code}${isCreate ? '-trans' : '-edit'}`} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onCancel}>{t('cancel')}</Button>
            <Button type="submit" data-testid={`button-${isCreate ? 'save' : 'update'}-category`} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isCreate ? t('create') : t('update')}
            </Button>
          </div>
        </form>
      </Form>
    );
  }, [form, languages, createMutation.isPending, updateMutation.isPending, t]);

  if (isLoading || languagesLoading) {
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
          <h1 className="text-2xl font-semibold">{t('categories')}</h1>
          <p className="text-muted-foreground">{t('categories_desc')}</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-category" disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('add_category')}
        </Button>
      </div>

      <DataTable
        data={categories.sort((a, b) => a.order - b.order)}
        columns={[
          {
            key: 'image',
            header: t('image'),
            render: (item) => item.image ? (
              <img src={item.image} alt={item.name.en} className="w-10 h-10 rounded-md object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            ),
          },
          { key: 'name', header: t('name'), render: (item) => item.generalName || item.name.en },
          { key: 'translations', header: t('translations'), render: (item) => {
            const count = Object.values(item.name).filter(v => v && v.length > 0).length;
            return `${count} ${t('languages_count')}`;
          }},
          { key: 'order', header: t('order') },
          { key: 'isActive', header: t('status'), render: (item) => (
            <div data-testid={`status-active-${item.id}`} className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${
              item.isActive 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
            }`}>
              {item.isActive ? t('active') : t('inactive')}
            </div>
          )},
        ]}
        onEdit={openEdit}
        onDelete={(item) => setDeleteCategory(item)}
        testIdPrefix="category"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="modal-category-form" dir={adminDir}>
          <DialogHeader>
            <DialogTitle>{t('add_category')}</DialogTitle>
          </DialogHeader>
          <FormContent onSubmit={handleCreate} onCancel={() => setFormOpen(false)} isCreate={true} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md" data-testid="modal-category-edit" dir={adminDir}>
          <DialogHeader>
            <DialogTitle>{t('edit_category')}</DialogTitle>
          </DialogHeader>
          <FormContent onSubmit={handleEdit} onCancel={() => setEditingCategory(null)} isCreate={false} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_category')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_category')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
