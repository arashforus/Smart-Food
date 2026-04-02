import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, Loader2, GripVertical, Pencil, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

const itemSchema = z.object({
  generalName: z.string().min(1, 'Internal name is required'),
  name: z.record(z.string(), z.string().min(1, 'Name is required')),
  shortDescription: z.record(z.string(), z.string().min(1, 'Short description is required')),
  longDescription: z.record(z.string(), z.string().optional()),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  discountedPrice: z.number().optional(),
  maxSelect: z.number().optional(),
  calories: z.number().int().min(0).optional(),
  preparationTime: z.number().int().min(1).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
  available: z.boolean(),
  suggested: z.boolean(),
  isNew: z.boolean(),
  smokeEffect: z.boolean().default(false),
  fireEffect: z.boolean().default(false),
  iceEffect: z.boolean().default(false),
  materials: z.array(z.string()),
  types: z.array(z.string()),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface StorageItem {
  id: string;
  categoryId: string;
  generalName?: string;
  name: Record<string, string>;
  shortDescription: Record<string, string>;
  longDescription: Record<string, string>;
  price: number;
  discountedPrice?: number;
  maxSelect?: number;
  calories?: number;
  preparationTime?: number;
  image?: string;
  available: boolean;
  suggested: boolean;
  isNew: boolean;
  smokeEffect?: boolean;
  fireEffect?: boolean;
  iceEffect?: boolean;
  materials?: string[];
  types?: string[];
  order?: number;
}

interface StorageCategory {
  id: string;
  name: Record<string, string>;
  image?: string;
  order?: string | number;
}

interface StorageMaterial {
  id: string;
  name: Record<string, string>;
  icon?: string;
  color?: string;
}

interface StorageFoodType {
  id: string;
  name: Record<string, string>;
  icon?: string;
  color?: string;
}

interface StorageLanguage {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface StorageSettings {
  currencySymbol: string;
  currencyDecimal?: number;
}

interface SortableItemRowProps {
  item: StorageItem;
  categories: StorageCategory[];
  settings?: StorageSettings;
  currencySymbol: string;
  onEdit: (item: StorageItem) => void;
  onDelete: (item: StorageItem) => void;
  t: any;
  isDragging?: boolean;
}

function SortableItemRow({ item, categories, settings, currencySymbol, onEdit, onDelete, t, isDragging }: SortableItemRowProps) {
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
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return 'Unknown';
    const nameData = cat.name;
    if (typeof nameData === 'string') return nameData;
    if (!nameData) return 'Unnamed';
    const directName = nameData.en || Object.values(nameData)[0];
    if (typeof directName === 'string') return directName;
    if (typeof directName === 'object' && directName !== null) {
      return (directName as any).en || Object.values(directName)[0] || 'Unnamed';
    }
    return 'Unnamed';
  };

  const getItemName = (nameData: Record<string, string>) => {
    if (typeof nameData === 'string') return nameData;
    if (!nameData) return 'Unnamed';
    const directName = nameData.en || Object.values(nameData)[0];
    if (typeof directName === 'string') return directName;
    if (typeof directName === 'object' && directName !== null) {
      return (directName as any).en || Object.values(directName)[0] || 'Unnamed';
    }
    return 'Unnamed';
  };

  const decimalPlaces = settings?.currencyDecimal ?? 2;
  const itemName = item.generalName || getItemName(item.name);

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-testid={`row-item-${item.id}`}
      className={isSortableDragging ? 'bg-muted/50' : undefined}
    >
      <TableCell className="w-8 px-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
          data-testid={`drag-handle-item-${item.id}`}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      <TableCell>
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={itemName} className="w-full h-full object-cover" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium">{itemName}</TableCell>
      <TableCell>{getCategoryName(item.categoryId)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {item.discountedPrice ? (
            <>
              <span className="text-muted-foreground line-through">{currencySymbol}{Number(item.price).toFixed(decimalPlaces)}</span>
              <span className="text-green-600 font-medium">{currencySymbol}{Number(item.discountedPrice).toFixed(decimalPlaces)}</span>
            </>
          ) : (
            <span>{currencySymbol}{Number(item.price).toFixed(decimalPlaces)}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={item.available ? 'default' : 'secondary'} className="no-default-active-elevate">
            {item.available ? t('available') : t('unavailable')}
          </Badge>
          {item.suggested && (
            <Badge variant="outline" className="no-default-active-elevate text-amber-600 border-amber-500/50">
              <Star className="h-3 w-3 mr-1 fill-amber-500" />
              {t('suggestedLabel')}
            </Badge>
          )}
          {item.isNew && (
            <Badge variant="outline" className="no-default-active-elevate text-blue-600 border-blue-500/50">
              {t('newLabel')}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            data-testid={`button-edit-item-${item.id}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            data-testid={`button-delete-item-${item.id}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ItemsPage() {
  const { t, adminLanguage } = useLanguage();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StorageItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<StorageItem | null>(null);
  const [orderedItems, setOrderedItems] = useState<StorageItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery<StorageItem[]>({
    queryKey: ['/api/items'],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<StorageCategory[]>({
    queryKey: ['/api/categories'],
  });

  const selectedCategoryId = form.watch('categoryId');
  const categoryImage = useMemo(() =>
    categories.find(c => c.id === selectedCategoryId)?.image
  , [selectedCategoryId, categories]);

  const { data: materials = [], isLoading: materialsLoading } = useQuery<StorageMaterial[]>({
    queryKey: ['/api/materials'],
  });

  const { data: foodTypes = [] } = useQuery<StorageFoodType[]>({
    queryKey: ['/api/food-types'],
  });

  const { data: languages = [], isLoading: languagesLoading } = useQuery<StorageLanguage[]>({
    queryKey: ['/api/languages'],
  });

  const { data: settings } = useQuery<StorageSettings>({
    queryKey: ['/api/settings'],
  });

  const sortedLanguages = useMemo(() => {
    return [...languages].sort((a, b) => a.order - b.order);
  }, [languages]);

  const sortedFromServer = useMemo(() => {
    const categoryOrderMap = new Map(
      categories.map((c) => [c.id, Number(c.order ?? 999)])
    );
    return [...items].sort((a, b) => {
      const catOrderA = categoryOrderMap.get(a.categoryId) ?? 999;
      const catOrderB = categoryOrderMap.get(b.categoryId) ?? 999;
      if (catOrderA !== catOrderB) return catOrderA - catOrderB;
      return (a.order ?? 1) - (b.order ?? 1);
    });
  }, [items, categories]);

  useEffect(() => {
    setOrderedItems(sortedFromServer);
  }, [sortedFromServer]);

  const reorderMutation = useMutation({
    mutationFn: async (reordered: StorageItem[]) => {
      const payload = reordered.map((item, index) => ({ id: item.id, order: index + 1 }));
      return apiRequest('POST', '/api/items/reorder', { items: payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    },
    onError: () => {
      setOrderedItems(sortedFromServer);
      toast({ title: t('error'), description: t('failedReorder') || 'Failed to save order', variant: 'destructive' });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      const payload = {
        categoryId: data.categoryId,
        generalName: data.generalName,
        name: data.name,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        price: parseFloat(String(data.price)),
        discountedPrice: data.discountedPrice ? parseFloat(String(data.discountedPrice)) : undefined,
        maxSelect: data.maxSelect ? parseFloat(String(data.maxSelect)) : undefined,
        calories: data.calories !== undefined ? parseInt(String(data.calories)) : null,
        preparationTime: data.preparationTime !== undefined ? parseInt(String(data.preparationTime)) : null,
        image: data.image || null,
        available: data.available,
        suggested: data.suggested,
        isNew: data.isNew,
        smokeEffect: data.smokeEffect,
        fireEffect: data.fireEffect,
        iceEffect: data.iceEffect,
        materials: data.materials,
        types: data.types,
      };
      return apiRequest('POST', '/api/items', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setFormOpen(false);
      form.reset();
      toast({ title: t('menuItemCreated') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failedCreateItem'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      if (!editingItem) throw new Error('No item selected');
      const payload = {
        categoryId: data.categoryId,
        generalName: data.generalName,
        name: data.name,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        price: parseFloat(String(data.price)),
        discountedPrice: data.discountedPrice ? parseFloat(String(data.discountedPrice)) : undefined,
        maxSelect: data.maxSelect ? parseFloat(String(data.maxSelect)) : undefined,
        calories: data.calories !== undefined ? parseInt(String(data.calories)) : null,
        preparationTime: data.preparationTime !== undefined ? parseInt(String(data.preparationTime)) : null,
        image: data.image || null,
        available: data.available,
        suggested: data.suggested,
        isNew: data.isNew,
        smokeEffect: data.smokeEffect,
        fireEffect: data.fireEffect,
        iceEffect: data.iceEffect,
        materials: data.materials,
        types: data.types,
      };
      return apiRequest('PATCH', `/api/items/${editingItem.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setEditingItem(null);
      form.reset();
      toast({ title: t('menuItemUpdated') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failedUpdateItem'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setDeleteItem(null);
      toast({ title: t('menuItemDeleted') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failedDeleteItem'), variant: 'destructive' });
    },
  });

  const openCreate = () => {
    const initialLangValues = languages.reduce((acc, lang) => {
      acc[lang.code] = '';
      return acc;
    }, {} as Record<string, string>);

    form.reset({
      generalName: '',
      name: initialLangValues,
      shortDescription: initialLangValues,
      longDescription: initialLangValues,
      price: 0,
      discountedPrice: undefined,
      maxSelect: undefined,
      calories: undefined,
      preparationTime: undefined,
      categoryId: categories[0]?.id || '',
      image: '',
      available: true,
      suggested: false,
      isNew: false,
      smokeEffect: false,
      fireEffect: false,
      iceEffect: false,
      materials: [],
      types: []
    });
    setFormOpen(true);
  };

  const openEdit = (item: StorageItem) => {
    const langCodes = languages.map(l => l.code);
    const itemNames = { ...item.name };
    const itemShorts = { ...item.shortDescription };
    const itemLongs = { ...item.longDescription };

    langCodes.forEach(code => {
      if (!itemNames[code]) itemNames[code] = '';
      if (!itemShorts[code]) itemShorts[code] = '';
      if (!itemLongs[code]) itemLongs[code] = '';
    });

    form.reset({
      generalName: item.generalName || '',
      name: itemNames,
      shortDescription: itemShorts,
      longDescription: itemLongs,
      price: item.price ? Number(item.price) : 0,
      discountedPrice: item.discountedPrice ? Number(item.discountedPrice) : undefined,
      maxSelect: item.maxSelect ? Number(item.maxSelect) : undefined,
      calories: item.calories ? Number(item.calories) : undefined,
      preparationTime: item.preparationTime ? Number(item.preparationTime) : undefined,
      categoryId: item.categoryId,
      image: item.image || '',
      available: item.available,
      suggested: item.suggested,
      isNew: item.isNew ?? false,
      smokeEffect: item.smokeEffect ?? false,
      fireEffect: item.fireEffect ?? false,
      iceEffect: item.iceEffect ?? false,
      materials: item.materials || [],
      types: item.types || [],
    });
    setEditingItem(item);
  };

  const handleCreate = (data: ItemFormData) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      discountedPrice: data.discountedPrice !== undefined ? Number(data.discountedPrice) : undefined,
      maxSelect: data.maxSelect !== undefined ? Number(data.maxSelect) : undefined,
      isNew: data.isNew,
    };
    createMutation.mutate(formattedData);
  };

  const handleEdit = (data: ItemFormData) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      discountedPrice: data.discountedPrice !== undefined ? Number(data.discountedPrice) : undefined,
      maxSelect: data.maxSelect !== undefined ? Number(data.maxSelect) : undefined,
      isNew: data.isNew,
    };
    updateMutation.mutate(formattedData);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      reorderMutation.mutate(reordered);
      return reordered;
    });
  };

  const currencySymbol = settings?.currencySymbol || '$';
  const activeItem = activeId ? orderedItems.find((i) => i.id === activeId) : null;

  if (itemsLoading || categoriesLoading || languagesLoading) {
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
          <h1 className="text-2xl font-semibold">{t('menuItemsTitle')}</h1>
          <p className="text-muted-foreground">{t('manageMenuOfferings')}</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-item" disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addItem')}
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead className="w-14">{t('image')}</TableHead>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions') || 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <SortableContext items={orderedItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <TableBody>
                {orderedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {t('noItems') || 'No items yet'}
                    </TableCell>
                  </TableRow>
                ) : (
                  orderedItems.map((item) => (
                    <SortableItemRow
                      key={item.id}
                      item={item}
                      categories={categories}
                      settings={settings}
                      currencySymbol={currencySymbol}
                      onEdit={openEdit}
                      onDelete={(i) => setDeleteItem(i)}
                      t={t}
                    />
                  ))
                )}
              </TableBody>
            </SortableContext>
          </Table>
        </div>
        <DragOverlay>
          {activeItem ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-background border rounded-md shadow-xl opacity-95">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {activeItem.image ? (
                  <img src={activeItem.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                )}
              </div>
              <span className="font-medium text-sm">{activeItem.generalName || activeItem.name?.en || Object.values(activeItem.name || {})[0] || 'Item'}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg h-[90vh] flex flex-col overflow-hidden" data-testid="modal-menu-item-form">
          <DialogHeader>
            <DialogTitle>{t('add_item')}</DialogTitle>
          </DialogHeader>
          <FormContent
            form={form}
            categories={categories}
            materials={materials}
            foodTypes={foodTypes}
            languages={languages}
            currencySymbol={currencySymbol}
            settings={settings}
            categoryImage={categoryImage}
            onSubmit={handleCreate}
            onCancel={() => setFormOpen(false)}
            isEdit={false}
            isPending={createMutation.isPending}
            t={t}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-lg h-[90vh] flex flex-col overflow-hidden" data-testid="modal-menu-item-edit">
          <DialogHeader>
            <DialogTitle>{t('edit_item')}</DialogTitle>
          </DialogHeader>
          <FormContent
            form={form}
            categories={categories}
            materials={materials}
            foodTypes={foodTypes}
            languages={languages}
            currencySymbol={currencySymbol}
            settings={settings}
            categoryImage={categoryImage}
            onSubmit={handleEdit}
            onCancel={() => setEditingItem(null)}
            isEdit={true}
            isPending={updateMutation.isPending}
            t={t}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteMenuItem')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmText').replace('{name}', deleteItem?.name[adminLanguage] || deleteItem?.name.en || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-item" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface FormContentProps {
  form: any;
  categories: StorageCategory[];
  materials: StorageMaterial[];
  foodTypes: StorageFoodType[];
  languages: StorageLanguage[];
  currencySymbol: string;
  settings?: StorageSettings;
  categoryImage?: string;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  isEdit: boolean;
  isPending: boolean;
  t: any;
}

function FormContent({
  form,
  categories,
  materials,
  foodTypes,
  languages,
  currencySymbol,
  settings,
  categoryImage,
  onSubmit,
  onCancel,
  isEdit,
  isPending,
  t,
}: FormContentProps) {
  const { toast } = useToast();
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(form.getValues('materials') || []);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(form.getValues('types') || []);

  const onFormError = (errors: any) => {
    const errorMessages = Object.values(errors)
      .map((error: any) => error.message)
      .filter(Boolean);

    if (errorMessages.length > 0) {
      toast({
        title: t('validationError'),
        description: errorMessages.join(". "),
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = (data: ItemFormData) => {
    onSubmit({ ...data, materials: selectedMaterials, types: selectedTypes });
  };

  const sortedLanguages = useMemo(() => {
    return [...languages].sort((a, b) => a.order - b.order);
  }, [languages]);

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit, onFormError)} className="flex flex-col flex-1 min-h-0 gap-4">
          <Tabs defaultValue="basic" className="flex flex-col flex-1 min-h-0 w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">{t('basic_tab')}</TabsTrigger>
              <TabsTrigger value="materials">{t('materials_tab')}</TabsTrigger>
              <TabsTrigger value="types">{t('types_tab')}</TabsTrigger>
              <TabsTrigger value="translations">{t('translations_tab')}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
              <FormField control={form.control} name="generalName" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('internal_name_Label')}</FormLabel>
                  <FormControl><Input {...field} data-testid={`input-item-general-name${isEdit ? '-edit' : ''}`} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('item_image')}</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={categoryImage || t('uploadImagePlaceholder')}
                        testId={`input-item-image${isEdit ? '-edit' : ''}`}
                      />
                    </FormControl>
                    <div className="flex items-center mt-2 border rounded-md bg-muted/20 divide-x h-12">
                      <FormField
                        control={form.control}
                        name="smokeEffect"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                            <FormLabel className="text-xs font-medium">{t('smokeLabel')}</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid={`switch-item-smoke${isEdit ? '-edit' : ''}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fireEffect"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                            <FormLabel className="text-xs font-medium">{t('fireLabel')}</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid={`switch-item-fire${isEdit ? '-edit' : ''}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="iceEffect"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                            <FormLabel className="text-xs font-medium">{t('iceLabel')}</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid={`switch-item-ice${isEdit ? '-edit' : ''}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
              )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('itemPrice')} ({currencySymbol})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={1 / Math.pow(10, settings?.currencyDecimal ?? 2)}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      data-testid={`input-item-price${isEdit ? '-edit' : ''}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="discountedPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('discountedPrice')} ({currencySymbol})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={1 / Math.pow(10, settings?.currencyDecimal ?? 2)}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder={t('cancel')}
                      data-testid={`input-item-discount${isEdit ? '-edit' : ''}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('itemCategory')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid={`select-item-category${isEdit ? '-edit' : ''}`}>
                          <SelectValue placeholder={t('selectCategoryPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                        <SelectContent>
                          {categories.map((cat) => {
                            const nameData = cat.name;
                            let displayName = 'Unnamed';
                            if (typeof nameData === 'string') {
                              displayName = nameData;
                            } else if (nameData) {
                              const directName = nameData.en || Object.values(nameData)[0];
                              if (typeof directName === 'string') {
                                displayName = directName;
                              } else if (typeof directName === 'object' && directName !== null) {
                                displayName = (directName as any).en || Object.values(directName)[0] || 'Unnamed';
                              }
                            }
                            return (
                              <SelectItem key={cat.id} value={cat.id}>{displayName}</SelectItem>
                            );
                          })}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="maxSelect" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('maxSelect')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder={t('unlimitedPlaceholder')}
                        data-testid={`input-item-maxselect${isEdit ? '-edit' : ''}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="calories" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('calories')} <span className="text-muted-foreground text-xs font-normal">({t('kcal')})</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder={t('caloriesPlaceholder')}
                        data-testid={`input-item-calories${isEdit ? '-edit' : ''}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="preparationTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('preparationTime')} <span className="text-muted-foreground text-xs font-normal">({t('minutes')})</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder={t('preparationTimePlaceholder')}
                        data-testid={`input-item-preparation-time${isEdit ? '-edit' : ''}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex items-center mt-4 border rounded-md bg-muted/20 divide-x h-12">
                <FormField control={form.control} name="available" render={({ field }) => (
                  <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                    <FormLabel className="text-xs font-medium">{t('available')}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-available${isEdit ? '-edit' : ''}`} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="suggested" render={({ field }) => (
                  <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                    <FormLabel className="text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      {t('suggestedLabel')}
                    </FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-suggested${isEdit ? '-edit' : ''}`} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isNew" render={({ field }) => (
                  <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                    <FormLabel className="text-xs font-medium">{t('newLabel')}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-new${isEdit ? '-edit' : ''}`} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            </TabsContent>

            <TabsContent value="materials" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
              <FormItem>
                <FormLabel>{t('selectMaterialsLabel')}</FormLabel>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover-elevate transition-colors"
                      data-testid={`checkbox-material-${material.id}${isEdit ? '-edit' : ''}`}
                    >
                      <Checkbox
                        checked={selectedMaterials.includes(material.id)}
                        onCheckedChange={(checked) => {
                          setSelectedMaterials(current =>
                            checked
                              ? [...current, material.id]
                              : current.filter(id => id !== material.id)
                          );
                        }}
                      />
                      {material.icon ? (
                        <div className="w-6 h-6 rounded overflow-hidden flex items-center justify-center">
                          {material.icon.includes('/') || material.icon.includes('http') || material.icon.length > 10 ? (
                            <img src={material.icon} alt={material.name.en} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{material.icon}</span>
                          )}
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: material.color || '#999' }}
                        >
                          {material.name.en?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm">{material.name.en || Object.values(material.name)[0]}</span>
                    </div>
                  ))}
                </div>
              </FormItem>
            </TabsContent>

            <TabsContent value="types" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
              <FormItem>
                <FormLabel>{t('selectFoodTypesLabel')}</FormLabel>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {foodTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover-elevate transition-colors"
                      data-testid={`checkbox-type-${type.id}${isEdit ? '-edit' : ''}`}
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) => {
                          setSelectedTypes(current =>
                            checked
                              ? [...current, type.id]
                              : current.filter(id => id !== type.id)
                          );
                        }}
                      />
                      {type.icon && (type.icon.includes('/') || type.icon.includes('http')) ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                          <img src={type.icon} alt={type.name.en} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: type.color || '#999' }}
                        >
                          {(() => {
                            const iconName = type.icon || 'Leaf';
                            const Icon = (LucideIcons as any)[iconName];
                            return Icon ? <Icon className="h-3 w-3" /> : <span className="text-[10px]">{iconName.charAt(0)}</span>;
                          })()}
                        </div>
                      )}
                      <span className="text-sm">{type.name.en || Object.values(type.name)[0]}</span>
                    </div>
                  ))}
                </div>
              </FormItem>
            </TabsContent>

            <TabsContent value="translations" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
              <div className="space-y-6 pb-4">
                {sortedLanguages.filter(lang => lang.isActive).map((language) => {
                  const langCode = language.code.charAt(0).toUpperCase() + language.code.slice(1).toLowerCase();

                  return (
                    <div key={language.id} className="space-y-4 p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2 border-b pb-2 mb-2">
                        <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-[10px] uppercase font-bold">
                          {language.code}
                        </span>
                        <h4 className="font-semibold text-sm">{language.name}</h4>
                      </div>

                    <FormField control={form.control} name={`name.${language.code}`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('itemName')} ({language.name})</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={typeof field.value === 'string' ? field.value : (typeof field.value === 'object' && field.value !== null ? ((field.value as any).en || Object.values(field.value)[0] || '') : '')}
                            data-testid={`input-item-name-${language.code}${isEdit ? '-edit' : ''}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name={`shortDescription.${language.code}`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('shortDescription')} ({language.name})</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={typeof field.value === 'string' ? field.value : (typeof field.value === 'object' && field.value !== null ? ((field.value as any).en || Object.values(field.value)[0] || '') : '')}
                            data-testid={`input-item-short-desc-${language.code}${isEdit ? '-edit' : ''}`}
                            placeholder={t('shortDescriptionPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name={`longDescription.${language.code}`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('longDescription')} ({language.name})</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={typeof field.value === 'string' ? field.value : (typeof field.value === 'object' && field.value !== null ? ((field.value as any).en || Object.values(field.value)[0] || '') : '')}
                            rows={3}
                            data-testid={`input-item-long-desc-${language.code}${isEdit ? '-edit' : ''}`}
                            placeholder={t('longDescriptionPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-2 flex-shrink-0 border-t">
            <Button type="button" variant="ghost" onClick={onCancel}>{t('cancel')}</Button>
            <Button type="submit" data-testid={`button-${isEdit ? 'update' : 'save'}-item`} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? t('update') : t('create')}
            </Button>
          </div>
        </form>
      </Form>
    );
}
