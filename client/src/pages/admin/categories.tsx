import { useState, useRef, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, Loader2, GripVertical, Pencil, Trash2 } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLanguage } from '@/hooks/use-language';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    if (lang.isActive) schema[`name_${lang.code}`] = z.string().optional();
  });
  return z.object(schema);
};

interface SortableCategoryRowProps {
  item: StorageCategory;
  onEdit: (item: StorageCategory) => void;
  onDelete: (item: StorageCategory) => void;
  t: (key: string, fallback?: string) => string;
}

function SortableCategoryRow({ item, onEdit, onDelete, t }: SortableCategoryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const translationCount = Object.values(item.name).filter(v => typeof v === 'string' && v.length > 0).length;

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'bg-muted/50' : ''}
      data-testid={`row-category-${item.id}`}
    >
      <TableCell className="w-8 px-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          data-testid={`drag-handle-category-${item.id}`}
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>

      <TableCell>
        {item.image ? (
          <img src={item.image} alt={item.generalName} className="w-10 h-10 rounded-md object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </TableCell>

      <TableCell>
        <span className="font-medium">{item.generalName || (typeof item.name.en === 'string' ? item.name.en : '')}</span>
      </TableCell>

      <TableCell>
        <span className="text-sm text-muted-foreground">{translationCount} {t('languages_count')}</span>
      </TableCell>

      <TableCell>
        <span className="text-sm font-medium">{item.order}</span>
      </TableCell>

      <TableCell>
        <div
          data-testid={`status-active-${item.id}`}
          className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${
            item.isActive
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
          }`}
        >
          {item.isActive ? t('active') : t('inactive')}
        </div>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            data-testid={`button-edit-category-${item.id}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            data-testid={`button-delete-category-${item.id}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function DragOverlayCategoryRow({ item, t }: { item: StorageCategory; t: (k: string, fb?: string) => string }) {
  const translationCount = Object.values(item.name).filter(v => typeof v === 'string' && v.length > 0).length;
  return (
    <TableRow className="bg-background shadow-lg border rounded-md opacity-95">
      <TableCell className="w-8 px-2">
        <div className="text-muted-foreground p-1"><GripVertical className="h-4 w-4" /></div>
      </TableCell>
      <TableCell>
        {item.image ? (
          <img src={item.image} alt={item.generalName} className="w-10 h-10 rounded-md object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </TableCell>
      <TableCell><span className="font-medium">{item.generalName}</span></TableCell>
      <TableCell><span className="text-sm text-muted-foreground">{translationCount} {t('languages_count')}</span></TableCell>
      <TableCell><span className="text-sm font-medium">{item.order}</span></TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.isActive ? t('active') : t('inactive')}
        </span>
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

export default function CategoriesPage() {
  const { t, adminDir } = useLanguage();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StorageCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<StorageCategory | null>(null);
  const [orderedCategories, setOrderedCategories] = useState<StorageCategory[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const { data: languages = [], isLoading: languagesLoading } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  const categorySchema = createCategorySchema(languages);
  type CategoryFormData = z.infer<typeof categorySchema>;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: languages.reduce((acc, lang) => {
      if (lang.isActive) acc[`name_${lang.code}`] = '';
      return acc;
    }, { name: '', image: '', order: 1, isActive: true } as any),
  });

  const { data: categories = [], isLoading } = useQuery<StorageCategory[]>({
    queryKey: ['/api/categories'],
  });

  useEffect(() => {
    const sorted = [...categories].sort((a, b) => Number(a.order) - Number(b.order));
    setOrderedCategories(sorted);
  }, [categories]);

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; order: number }[]) =>
      apiRequest('POST', '/api/categories/reorder', items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: () => {
      const sorted = [...categories].sort((a, b) => Number(a.order) - Number(b.order));
      setOrderedCategories(sorted);
      toast({ title: t('error', 'Error'), description: 'Failed to save order', variant: 'destructive' });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        if (lang.isActive) nameObj[lang.code] = (data as any)[`name_${lang.code}`] || '';
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
      toast({ title: t('category_created', 'Category Created') });
    },
    onError: (error: any) => {
      toast({ title: t('error', 'Error'), description: error.message || t('failed_create_category', 'Failed to create category'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      if (!editingCategory) throw new Error('No category selected');
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        if (lang.isActive) nameObj[lang.code] = (data as any)[`name_${lang.code}`] || '';
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
      toast({ title: t('category_updated', 'Category Updated') });
    },
    onError: (error: any) => {
      toast({ title: t('error', 'Error'), description: error.message || t('failed_update_category', 'Failed to update category'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest('DELETE', `/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setDeleteCategory(null);
      toast({ title: t('category_deleted', 'Category Deleted') });
    },
    onError: (error: any) => {
      toast({ title: t('error', 'Error'), description: error.message || t('failed_delete_category', 'Failed to delete category'), variant: 'destructive' });
    },
  });

  const openCreate = () => {
    const defaultValues: any = {
      name: '',
      image: '',
      order: (categories.length || 0) + 1,
      isActive: true,
    };
    languages.forEach((lang) => {
      if (lang.isActive) defaultValues[`name_${lang.code}`] = '';
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
      if (lang.isActive) defaultValues[`name_${lang.code}`] = category.name[lang.code] || '';
    });
    form.reset(defaultValues);
    setEditingCategory(category);
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setOrderedCategories((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(prev, oldIndex, newIndex);
      const updates = newOrder.map((item, idx) => ({ id: item.id, order: idx + 1 }));
      reorderMutation.mutate(updates);
      return newOrder.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const activeItem = activeId ? orderedCategories.find((c) => c.id === activeId) : null;

  const FormContent = useMemo(() => {
    return ({ onSubmit, onCancel, isCreate }: { onSubmit: (data: CategoryFormData) => void; onCancel: () => void; isCreate: boolean }) => (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 gap-4">
          <Tabs defaultValue="info" className="flex flex-col flex-1 min-h-0 w-full" dir={adminDir}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">{t('info')}</TabsTrigger>
              <TabsTrigger value="translations">{t('translations')}</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
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
                    <ImageUpload
                      value={field.value || ''}
                      onChange={(url) => field.onChange(url)}
                      placeholder={t('upload_category_image')}
                      testId="input-category-image"
                    />
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

            <TabsContent value="translations" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
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

          <div className="flex justify-end gap-2 pt-2 flex-shrink-0 border-t">
            <Button type="button" variant="ghost" onClick={onCancel}>{t('cancel')}</Button>
            <Button type="submit" data-testid={`button-${isCreate ? 'save' : 'update'}-category`} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isCreate ? t('create') : t('update')}
            </Button>
          </div>
        </form>
      </Form>
    );
  }, [form, languages, createMutation.isPending, updateMutation.isPending, t, adminDir]);

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

      <div className="rounded-md border" dir={adminDir}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 px-2" />
              <TableHead>{t('image')}</TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('translations')}</TableHead>
              <TableHead>{t('order')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-end">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedCategories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedCategories.map((item) => (
                    <SortableCategoryRow
                      key={item.id}
                      item={item}
                      onEdit={openEdit}
                      onDelete={setDeleteCategory}
                      t={t}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeItem ? (
                    <Table>
                      <TableBody>
                        <DragOverlayCategoryRow item={activeItem} t={t} />
                      </TableBody>
                    </Table>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="h-[90vh] flex flex-col overflow-hidden" data-testid="modal-category-form" dir={adminDir}>
          <DialogHeader>
            <DialogTitle>{t('add_category')}</DialogTitle>
          </DialogHeader>
          <FormContent onSubmit={(data) => createMutation.mutate(data)} onCancel={() => setFormOpen(false)} isCreate={true} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="h-[90vh] flex flex-col overflow-hidden max-w-md" data-testid="modal-category-edit" dir={adminDir}>
          <DialogHeader>
            <DialogTitle>{t('edit_category')}</DialogTitle>
          </DialogHeader>
          <FormContent onSubmit={(data) => updateMutation.mutate(data)} onCancel={() => setEditingCategory(null)} isCreate={false} />
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
            <AlertDialogAction onClick={() => deleteCategory && deleteMutation.mutate(deleteCategory.id)} data-testid="button-confirm-delete" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
