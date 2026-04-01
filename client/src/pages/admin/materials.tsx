import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Globe, Info, GripVertical, Pencil, Trash2 } from 'lucide-react';
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
  FormDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Language } from '@/lib/types';
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

interface DbMaterial {
  id: string;
  generalName: string;
  name: Record<string, string>;
  color: string;
  icon: string | null;
  order: number;
  isActive: boolean;
}

const materialSchema = z.object({
  generalName: z.string().min(1, 'General name is required'),
  backgroundColor: z.string().min(1, 'Background color is required'),
  image: z.string().optional(),
  order: z.coerce.number().min(0, 'Order must be 0 or greater'),
  isActive: z.boolean(),
  translations: z.record(z.string()).optional(),
});

type MaterialFormData = z.infer<typeof materialSchema>;

function MaterialPreview({ item }: { item: DbMaterial }) {
  if (item.icon) {
    const isUrl = item.icon.includes('/') || item.icon.includes('http') || item.icon.length > 10;
    return (
      <div className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center">
        {isUrl ? (
          <img src={item.icon} alt={item.generalName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">{item.icon}</span>
        )}
      </div>
    );
  }
  return (
    <div
      className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-medium"
      style={{ backgroundColor: item.color || '#ccc' }}
    >
      {item.generalName?.charAt(0).toUpperCase()}
    </div>
  );
}

interface SortableMaterialRowProps {
  item: DbMaterial;
  onEdit: (item: DbMaterial) => void;
  onDelete: (item: DbMaterial) => void;
  t: (key: string) => string;
}

function SortableMaterialRow({ item, onEdit, onDelete, t }: SortableMaterialRowProps) {
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

  const translationCount = Object.values(item.name || {}).filter(v => v && String(v).trim() !== '').length;

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'bg-muted/50' : ''}
      data-testid={`row-material-${item.id}`}
    >
      <TableCell className="w-8 px-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          data-testid={`drag-handle-material-${item.id}`}
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>

      <TableCell>
        <MaterialPreview item={item} />
      </TableCell>

      <TableCell>
        <span className="font-medium">{item.generalName || (item.name as any)?.en || 'N/A'}</span>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{translationCount}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color || 'transparent' }} />
          <span className="text-xs text-muted-foreground">{item.color}</span>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm font-medium" data-testid={`text-material-order-${item.id}`}>
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
          data-testid={`status-material-enabled-${item.id}`}
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
            data-testid={`button-edit-material-${item.id}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            data-testid={`button-delete-material-${item.id}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function DragOverlayMaterialRow({ item, t }: { item: DbMaterial; t: (k: string) => string }) {
  const translationCount = Object.values(item.name || {}).filter(v => v && String(v).trim() !== '').length;
  return (
    <TableRow className="bg-background shadow-lg border rounded-md opacity-95">
      <TableCell className="w-8 px-2">
        <div className="text-muted-foreground p-1"><GripVertical className="h-4 w-4" /></div>
      </TableCell>
      <TableCell><MaterialPreview item={item} /></TableCell>
      <TableCell><span className="font-medium">{item.generalName}</span></TableCell>
      <TableCell><span className="text-sm">{translationCount}</span></TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-muted-foreground">{item.color}</span>
        </div>
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

export default function MaterialsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<DbMaterial | null>(null);
  const [deleteMaterialState, setDeleteMaterialState] = useState<DbMaterial | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [orderedMaterials, setOrderedMaterials] = useState<DbMaterial[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const { data: languages = [] } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      generalName: '',
      backgroundColor: '#FF6B6B',
      image: '',
      order: 1,
      isActive: true,
      translations: {},
    },
  });

  const { data: materials = [], isLoading } = useQuery<DbMaterial[]>({
    queryKey: ['/api/materials'],
  });

  useEffect(() => {
    const sorted = [...materials].sort((a, b) => Number(a.order) - Number(b.order));
    setOrderedMaterials(sorted);
  }, [materials]);

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; order: number }[]) =>
      apiRequest('POST', '/api/materials/reorder', items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
    },
    onError: () => {
      const sorted = [...materials].sort((a, b) => Number(a.order) - Number(b.order));
      setOrderedMaterials(sorted);
      toast({ title: t('error'), description: 'Failed to save order', variant: 'destructive' });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      const name: Record<string, string> = { ...data.translations };
      return apiRequest('POST', '/api/materials', {
        generalName: data.generalName,
        name,
        color: data.backgroundColor,
        icon: data.image,
        order: data.order,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setFormOpen(false);
      form.reset();
      toast({ title: t('material_added') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_add_material'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      if (!editingMaterial) throw new Error('No material selected');
      const name: Record<string, string> = { ...data.translations };
      return apiRequest('PATCH', `/api/materials/${editingMaterial.id}`, {
        generalName: data.generalName,
        name,
        color: data.backgroundColor,
        icon: data.image,
        order: data.order,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setEditingMaterial(null);
      form.reset();
      toast({ title: t('material_updated') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_update_material'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest('DELETE', `/api/materials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setDeleteMaterialState(null);
      toast({ title: t('material_deleted') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_delete_material'), variant: 'destructive' });
    },
  });

  const openCreate = () => {
    form.reset({ generalName: '', backgroundColor: '#FF6B6B', image: '', order: 1, isActive: true, translations: {} });
    setActiveTab('info');
    setFormOpen(true);
  };

  const openEdit = (material: DbMaterial) => {
    form.reset({
      generalName: material.generalName || '',
      backgroundColor: material.color || '#FF6B6B',
      image: material.icon || '',
      order: Number(material.order) || 1,
      isActive: material.isActive ?? true,
      translations: material.name || {},
    });
    setActiveTab('info');
    setEditingMaterial(material);
  };

  const onSubmit = (data: MaterialFormData) => {
    if (editingMaterial) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setOrderedMaterials((prev) => {
      const oldIndex = prev.findIndex((m) => m.id === active.id);
      const newIndex = prev.findIndex((m) => m.id === over.id);
      const newOrder = arrayMove(prev, oldIndex, newIndex);
      const updates = newOrder.map((item, idx) => ({ id: item.id, order: idx + 1 }));
      reorderMutation.mutate(updates);
      return newOrder.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const activeItem = activeId ? orderedMaterials.find((m) => m.id === activeId) : null;

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
          <h1 className="text-2xl font-semibold">{t('materials_ingredients')}</h1>
          <p className="text-muted-foreground">{t('materials_desc')}</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-material">
          <Plus className="h-4 w-4 mr-2" />
          {t('add_material')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 px-2" />
              <TableHead>{t('preview')}</TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('translations')}</TableHead>
              <TableHead>{t('color')}</TableHead>
              <TableHead>{t('order')}</TableHead>
              <TableHead>{t('enabled')}</TableHead>
              <TableHead className="text-end">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderedMaterials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No materials found
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
                  items={orderedMaterials.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedMaterials.map((item) => (
                    <SortableMaterialRow
                      key={item.id}
                      item={item}
                      onEdit={openEdit}
                      onDelete={setDeleteMaterialState}
                      t={t}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeItem ? (
                    <Table>
                      <TableBody>
                        <DragOverlayMaterialRow item={activeItem} t={t} />
                      </TableBody>
                    </Table>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen || !!editingMaterial} onOpenChange={(open) => {
        if (!open) { setFormOpen(false); setEditingMaterial(null); }
      }}>
        <DialogContent className="max-w-2xl h-[90vh] overflow-hidden flex flex-col" data-testid="modal-material-form">
          <DialogHeader>
            <DialogTitle>{editingMaterial ? t('edit_material') : t('add_material')}</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                {t('info')}
              </TabsTrigger>
              <TabsTrigger value="translation" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t('translation')}
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 min-h-0 flex flex-col gap-4">
                <TabsContent value="info" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1 m-0">
                  <FormField control={form.control} name="generalName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Tomato" data-testid="input-material-general-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('image')} ({t('optional')})</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t('upload_image')}
                          testId="input-material-image"
                        />
                      </FormControl>
                      <FormDescription>{t('material_image_desc')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="backgroundColor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('background_color')}</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-14 h-9 p-1" data-testid="input-material-color" />
                          <Input {...field} placeholder="#FF6B6B" className="flex-1" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="order" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('order')}</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} data-testid="input-material-order" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="isActive" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <FormLabel className="mb-0">{t('enabled')}</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-material-enabled" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </TabsContent>

                <TabsContent value="translation" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((lang: any) => (
                      <FormField
                        key={lang.code}
                        control={form.control}
                        name={`translations.${lang.code}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang.name} {t('translation')}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ''}
                                placeholder={`${t('name')} in ${lang.name}`}
                                data-testid={`input-material-translation-${lang.code}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    {languages.length === 0 && (
                      <div className="col-span-2 py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                        {t('no_languages_defined')}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <div className="flex justify-end gap-2 pt-2 flex-shrink-0 border-t">
                  <Button type="button" variant="ghost" onClick={() => { setFormOpen(false); setEditingMaterial(null); }}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-material">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingMaterial ? t('update') : t('create')}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteMaterialState} onOpenChange={() => setDeleteMaterialState(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_material')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_material').replace('{name}', deleteMaterialState?.generalName || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMaterialState && deleteMutation.mutate(deleteMaterialState.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
