import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LucideIconPicker from '@/components/admin/LucideIconPicker';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import type { UseFormReturn } from 'react-hook-form';

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

interface DbLanguage {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

const typeSchema = z.object({
  generalName: z.string().min(1, 'General name is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  order: z.coerce.number().min(0, 'Order must be 0 or greater'),
  isActive: z.boolean(),
  names: z.record(z.string().optional()),
});

type TypeFormData = z.infer<typeof typeSchema>;

interface DbFoodType {
  id: string;
  generalName: string;
  name: Record<string, string>;
  description: Record<string, string>;
  icon: string | null;
  color: string;
  isActive: boolean;
  order: number;
}

function DynamicIcon({ name, className }: { name?: string | null; className?: string }) {
  if (!name) return null;
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <span className="text-xs opacity-50">{name}</span>;
  return <Icon className={className} />;
}

interface TypeFormProps {
  form: UseFormReturn<TypeFormData>;
  languages: DbLanguage[];
  onSubmit: (data: TypeFormData) => void;
  isEdit: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  t: (key: string) => string;
}

function TypeForm({ form, languages, onSubmit, isEdit, isSubmitting, onCancel, t }: TypeFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 gap-4">
        <Tabs defaultValue="info" className="flex flex-col flex-1 min-h-0 w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">{t('info')}</TabsTrigger>
            <TabsTrigger value="translation">{t('translation')}</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
            <FormField
              control={form.control}
              name="generalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Vegan"
                      data-testid={isEdit ? 'input-type-general-name-edit' : 'input-type-general-name'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('icon')}</FormLabel>
                  <FormControl>
                    <LucideIconPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('color')}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-14 h-9 p-0 border-rounded-xl"
                        data-testid={isEdit ? 'input-type-color-edit' : 'input-type-color'}
                      />
                      <Input {...field} placeholder="#4CAF50" className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('order')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      data-testid={isEdit ? 'input-type-order-edit' : 'input-type-order'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormLabel className="mb-0">{t('enabled')}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid={isEdit ? 'switch-type-enabled-edit' : 'switch-type-enabled'}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="translation" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
            {languages.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('no_languages_defined')}</p>
            ) : (
              languages.map((lang) => (
                <FormField
                  key={lang.code}
                  control={form.control}
                  name={`names.${lang.code}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang.name}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          placeholder={`${t('name')} in ${lang.name}`}
                          data-testid={`input-type-name-${lang.code}${isEdit ? '-edit' : ''}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-2 flex-shrink-0 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            data-testid={isEdit ? 'button-update-type' : 'button-save-type'}
            disabled={isSubmitting}
          >
            {isEdit
              ? (isSubmitting ? t('updating') : t('update'))
              : (isSubmitting ? t('creating') : t('create'))}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface SortableRowProps {
  item: DbFoodType;
  onEdit: (item: DbFoodType) => void;
  onDelete: (item: DbFoodType) => void;
  getTranslationCount: (nameObj: any) => number;
  t: (key: string) => string;
  isDragging?: boolean;
}

function SortableRow({ item, onEdit, onDelete, getTranslationCount, t, isDragging }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
    zIndex: isSortableDragging ? 10 : undefined,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${isSortableDragging ? 'bg-muted/50' : ''}`}
      data-testid={`row-type-${item.id}`}
    >
      <TableCell className="w-8 px-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          data-testid={`drag-handle-type-${item.id}`}
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>

      <TableCell>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white overflow-hidden"
          style={{ backgroundColor: item.color }}
        >
          <div className="scale-75">
            <DynamicIcon name={item.icon} className="h-4 w-4" />
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span className="font-medium">{item.generalName || (item.name as any)?.en || 'N/A'}</span>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1 text-muted-foreground">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
            <span className="text-[10px] font-bold">🌐</span>
          </div>
          <span className="text-xs font-medium">{getTranslationCount(item.name)}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1.5">
          <DynamicIcon name={item.icon} className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{item.icon}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-muted-foreground">{item.color}</span>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm font-medium" data-testid={`text-type-order-${item.id}`}>
          {Number(item.order)}
        </span>
      </TableCell>

      <TableCell>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            item.isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
          }`}
          data-testid={`status-type-enabled-${item.id}`}
        >
          {item.isActive ? t('yes') : t('no')}
        </span>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            data-testid={`button-edit-type-${item.id}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            data-testid={`button-delete-type-${item.id}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function DragOverlayRow({ item, getTranslationCount, t }: { item: DbFoodType; getTranslationCount: (n: any) => number; t: (k: string) => string }) {
  return (
    <TableRow className="bg-background shadow-lg border rounded-md opacity-95">
      <TableCell className="w-8 px-2">
        <div className="text-muted-foreground p-1">
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      <TableCell>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
          <div className="scale-75"><DynamicIcon name={item.icon} className="h-4 w-4" /></div>
        </div>
      </TableCell>
      <TableCell><span className="font-medium">{item.generalName}</span></TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">{getTranslationCount(item.name)}</span>
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">{item.icon}</span>
      </TableCell>
      <TableCell>
        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
      </TableCell>
      <TableCell><span className="text-sm font-medium">{Number(item.order)}</span></TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.isActive ? t('yes') : t('no')}
        </span>
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

export default function TypesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<DbFoodType | null>(null);
  const [deleteType, setDeleteType] = useState<DbFoodType | null>(null);
  const [orderedTypes, setOrderedTypes] = useState<DbFoodType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const { data: dbFoodTypes = [], isLoading } = useQuery({
    queryKey: ['/api/food-types'],
    queryFn: async () => {
      const response = await fetch('/api/food-types');
      if (!response.ok) throw new Error('Failed to fetch food types');
      return response.json() as Promise<DbFoodType[]>;
    },
  });

  useEffect(() => {
    const sorted = [...dbFoodTypes].sort((a, b) => Number(a.order) - Number(b.order));
    setOrderedTypes(sorted);
  }, [dbFoodTypes]);

  const getTranslationCount = (nameObj: any) => {
    if (!nameObj || typeof nameObj !== 'object') return 0;
    return Object.values(nameObj).filter(val => typeof val === 'string' && (val as string).trim() !== '').length;
  };

  const { data: languages = [] } = useQuery({
    queryKey: ['/api/languages'],
    queryFn: async () => {
      const response = await fetch('/api/languages');
      if (!response.ok) throw new Error('Failed to fetch languages');
      return response.json() as Promise<DbLanguage[]>;
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; order: number }[]) =>
      apiRequest('POST', '/api/food-types/reorder', items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-types'] });
    },
    onError: () => {
      setOrderedTypes([...dbFoodTypes].sort((a, b) => Number(a.order) - Number(b.order)));
      toast({ title: t('error'), description: 'Failed to save order', variant: 'destructive' });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TypeFormData) => {
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => { nameObj[lang.code] = data.names[lang.code] || ''; });
      return apiRequest('POST', '/api/food-types', {
        generalName: data.generalName,
        name: nameObj,
        description: {},
        icon: data.icon,
        color: data.color,
        order: data.order,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-types'] });
      setFormOpen(false);
      form.reset();
      toast({ title: t('food_type_added') });
    },
    onError: () => {
      toast({ title: t('error'), description: t('failed_create_type'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TypeFormData) => {
      if (!editingType) throw new Error('No type selected');
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => { nameObj[lang.code] = data.names[lang.code] || ''; });
      return apiRequest('PATCH', `/api/food-types/${editingType.id}`, {
        generalName: data.generalName,
        name: nameObj,
        description: {},
        icon: data.icon,
        color: data.color,
        order: data.order,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-types'] });
      setEditingType(null);
      form.reset();
      toast({ title: t('food_type_updated') });
    },
    onError: () => {
      toast({ title: t('error'), description: t('failed_update_type'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/food-types/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-types'] });
      setDeleteType(null);
      toast({ title: t('food_type_deleted') });
    },
    onError: () => {
      toast({ title: t('error'), description: t('failed_delete_type'), variant: 'destructive' });
    },
  });

  const form = useForm<TypeFormData>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      generalName: '',
      icon: 'Leaf',
      color: '#4CAF50',
      order: 1,
      isActive: true,
      names: {},
    },
  });

  const openCreate = () => {
    setEditingType(null);
    const defaultNames: Record<string, string> = {};
    languages.forEach((lang) => { defaultNames[lang.code] = ''; });
    form.reset({ generalName: '', icon: 'Leaf', color: '#4CAF50', order: 1, isActive: true, names: defaultNames });
    setFormOpen(true);
  };

  const openEdit = (foodType: DbFoodType) => {
    setFormOpen(false);
    const names: Record<string, string> = {};
    languages.forEach((lang) => { names[lang.code] = foodType.name[lang.code] || ''; });
    form.reset({
      generalName: foodType.generalName || '',
      icon: foodType.icon || 'Leaf',
      color: foodType.color,
      order: Number(foodType.order) || 1,
      isActive: foodType.isActive ?? true,
      names,
    });
    setEditingType(foodType);
  };

  const handleCreate = (data: TypeFormData) => createMutation.mutate(data);
  const handleEdit = (data: TypeFormData) => updateMutation.mutate(data);
  const handleDelete = () => { if (deleteType) deleteMutation.mutate(deleteType.id); };

  const handleCancelCreate = useCallback(() => { setFormOpen(false); form.reset(); }, [form]);
  const handleCancelEdit = useCallback(() => { setEditingType(null); form.reset(); }, [form]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    setOrderedTypes((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(prev, oldIndex, newIndex);

      const updates = newOrder.map((item, idx) => ({ id: item.id, order: idx + 1 }));
      reorderMutation.mutate(updates);

      return newOrder.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const activeItem = activeId ? orderedTypes.find((t) => t.id === activeId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{t('food_types_tags')}</h1>
          <p className="text-muted-foreground">{t('food_types_desc')}</p>
        </div>
        <Button onClick={openCreate} disabled={isLoading} data-testid="button-add-type">
          <Plus className="h-4 w-4 mr-2" />
          {t('add_type')}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">{t('loading_food_types')}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 px-2" />
                <TableHead>{t('preview')}</TableHead>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('translations')}</TableHead>
                <TableHead>{t('icon')}</TableHead>
                <TableHead>{t('color')}</TableHead>
                <TableHead>{t('order')}</TableHead>
                <TableHead>{t('enabled')}</TableHead>
                <TableHead className="text-end">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No food types found
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
                    items={orderedTypes.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {orderedTypes.map((item) => (
                      <SortableRow
                        key={item.id}
                        item={item}
                        onEdit={openEdit}
                        onDelete={(ft) => setDeleteType(ft)}
                        getTranslationCount={getTranslationCount}
                        t={t}
                      />
                    ))}
                  </SortableContext>
                  <DragOverlay>
                    {activeItem ? (
                      <Table>
                        <TableBody>
                          <DragOverlayRow item={activeItem} getTranslationCount={getTranslationCount} t={t} />
                        </TableBody>
                      </Table>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => { if (!open) { setFormOpen(false); form.reset(); } }}
      >
        <DialogContent className="h-[90vh] flex flex-col overflow-hidden" data-testid="modal-type-form">
          <DialogHeader>
            <DialogTitle>{t('add_type')}</DialogTitle>
          </DialogHeader>
          <TypeForm
            form={form}
            languages={languages}
            onSubmit={handleCreate}
            isEdit={false}
            isSubmitting={createMutation.isPending}
            onCancel={handleCancelCreate}
            t={t}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingType}
        onOpenChange={(open) => { if (!open) { setEditingType(null); form.reset(); } }}
      >
        <DialogContent className="h-[90vh] flex flex-col overflow-hidden" data-testid="modal-type-edit">
          <DialogHeader>
            <DialogTitle>{t('edit_type')}</DialogTitle>
          </DialogHeader>
          <TypeForm
            form={form}
            languages={languages}
            onSubmit={handleEdit}
            isEdit={true}
            isSubmitting={updateMutation.isPending}
            onCancel={handleCancelEdit}
            t={t}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteType} onOpenChange={() => setDeleteType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_type')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_type').replace('{name}', deleteType?.generalName || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="button-confirm-delete-type"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t('deleting') : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
