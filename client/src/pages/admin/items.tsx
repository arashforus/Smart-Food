import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, Loader2 } from 'lucide-react';
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
import { apiRequest, queryClient } from '@/lib/queryClient';

const itemSchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameEs: z.string().optional(),
  nameFr: z.string().optional(),
  nameFa: z.string().optional(),
  nameTr: z.string().optional(),
  shortDescriptionEn: z.string().min(1, 'Short description is required'),
  shortDescriptionEs: z.string().optional(),
  shortDescriptionFr: z.string().optional(),
  shortDescriptionFa: z.string().optional(),
  shortDescriptionTr: z.string().optional(),
  longDescriptionEn: z.string().optional(),
  longDescriptionEs: z.string().optional(),
  longDescriptionFr: z.string().optional(),
  longDescriptionFa: z.string().optional(),
  longDescriptionTr: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  discountedPrice: z.number().optional(),
  maxSelect: z.number().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
  available: z.boolean(),
  suggested: z.boolean(),
  isNew: z.boolean(),
  materials: z.array(z.string()),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface StorageItem {
  id: string;
  categoryId: string;
  name: Record<string, string>;
  shortDescription: Record<string, string>;
  longDescription: Record<string, string>;
  price: number;
  discountedPrice?: number;
  maxSelect?: number;
  image?: string;
  available: boolean;
  suggested: boolean;
  materials?: string[];
  types?: string[];
}

interface StorageCategory {
  id: string;
  name: Record<string, string>;
}

interface StorageMaterial {
  id: string;
  name: Record<string, string>;
  image?: string;
  backgroundColor?: string;
}

export default function ItemsPage() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StorageItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<StorageItem | null>(null);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '',
      shortDescriptionEn: '', shortDescriptionEs: '', shortDescriptionFr: '', shortDescriptionFa: '', shortDescriptionTr: '',
      longDescriptionEn: '', longDescriptionEs: '', longDescriptionFr: '', longDescriptionFa: '', longDescriptionTr: '',
      price: 0, discountedPrice: undefined, maxSelect: undefined, categoryId: '', image: '', available: true, suggested: false, isNew: false, materials: []
    },
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery<StorageItem[]>({
    queryKey: ['/api/items'],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<StorageCategory[]>({
    queryKey: ['/api/categories'],
  });

  const { data: materials = [], isLoading: materialsLoading } = useQuery<StorageMaterial[]>({
    queryKey: ['/api/materials'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      return apiRequest('POST', '/api/items', {
        categoryId: data.categoryId,
        name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
        shortDescription: { en: data.shortDescriptionEn, es: data.shortDescriptionEs || '', fr: data.shortDescriptionFr || '', fa: data.shortDescriptionFa || '', tr: data.shortDescriptionTr || '' },
        longDescription: { en: data.longDescriptionEn || '', es: data.longDescriptionEs || '', fr: data.longDescriptionFr || '', fa: data.longDescriptionFa || '', tr: data.longDescriptionTr || '' },
        price: data.price,
        discountedPrice: data.discountedPrice,
        maxSelect: data.maxSelect,
        image: data.image || null,
        available: data.available,
        suggested: data.suggested,
        materials: data.materials,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setFormOpen(false);
      form.reset();
      toast({ title: 'Menu Item Created' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create item', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      if (!editingItem) throw new Error('No item selected');
      return apiRequest('PATCH', `/api/items/${editingItem.id}`, {
        categoryId: data.categoryId,
        name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
        shortDescription: { en: data.shortDescriptionEn, es: data.shortDescriptionEs || '', fr: data.shortDescriptionFr || '', fa: data.shortDescriptionFa || '', tr: data.shortDescriptionTr || '' },
        longDescription: { en: data.longDescriptionEn || '', es: data.longDescriptionEs || '', fr: data.longDescriptionFr || '', fa: data.longDescriptionFa || '', tr: data.longDescriptionTr || '' },
        price: data.price,
        discountedPrice: data.discountedPrice,
        maxSelect: data.maxSelect,
        image: data.image || null,
        available: data.available,
        suggested: data.suggested,
        materials: data.materials,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setEditingItem(null);
      form.reset();
      toast({ title: 'Menu Item Updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update item', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setDeleteItem(null);
      toast({ title: 'Menu Item Deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete item', variant: 'destructive' });
    },
  });

  const openCreate = () => {
    form.reset({
      nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '',
      shortDescriptionEn: '', shortDescriptionEs: '', shortDescriptionFr: '', shortDescriptionFa: '', shortDescriptionTr: '',
      longDescriptionEn: '', longDescriptionEs: '', longDescriptionFr: '', longDescriptionFa: '', longDescriptionTr: '',
      price: 0, discountedPrice: undefined, maxSelect: undefined, categoryId: categories[0]?.id || '', image: '', available: true, suggested: false, isNew: false, materials: []
    });
    setFormOpen(true);
  };

  const openEdit = (item: StorageItem) => {
    form.reset({
      nameEn: item.name.en || '',
      nameEs: item.name.es || '',
      nameFr: item.name.fr || '',
      nameFa: item.name.fa || '',
      nameTr: item.name.tr || '',
      shortDescriptionEn: item.shortDescription.en || '',
      shortDescriptionEs: item.shortDescription.es || '',
      shortDescriptionFr: item.shortDescription.fr || '',
      shortDescriptionFa: item.shortDescription.fa || '',
      shortDescriptionTr: item.shortDescription.tr || '',
      longDescriptionEn: item.longDescription.en || '',
      longDescriptionEs: item.longDescription.es || '',
      longDescriptionFr: item.longDescription.fr || '',
      longDescriptionFa: item.longDescription.fa || '',
      longDescriptionTr: item.longDescription.tr || '',
      price: item.price,
      discountedPrice: item.discountedPrice,
      maxSelect: item.maxSelect,
      categoryId: item.categoryId,
      image: item.image || '',
      available: item.available,
      suggested: item.suggested,
      isNew: false,
      materials: item.materials || [],
    });
    setEditingItem(item);
  };

  const handleCreate = (data: ItemFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: ItemFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id);
  };

  const getCategoryName = (categoryId: string) => categories.find((c) => c.id === categoryId)?.name.en || 'Unknown';

  const FormContent = ({ onSubmit, onCancel, isEdit }: { onSubmit: (data: ItemFormData) => void; onCancel: () => void; isEdit: boolean }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="translations">Translations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField control={form.control} name="nameEn" render={({ field }) => (
              <FormItem>
                <FormLabel>Name (English)</FormLabel>
                <FormControl><Input {...field} data-testid={`input-item-name${isEdit ? '-edit' : ''}`} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="image" render={({ field }) => (
              <FormItem>
                <FormLabel>Item Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Upload image or enter URL"
                    testId={`input-item-image${isEdit ? '-edit' : ''}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} data-testid={`input-item-price${isEdit ? '-edit' : ''}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="discountedPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Discounted Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                      placeholder="Optional"
                      data-testid={`input-item-discount${isEdit ? '-edit' : ''}`} 
                    />
                  </FormControl>
                  <FormDescription>Leave empty for no discount</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid={`select-item-category${isEdit ? '-edit' : ''}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name.en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="maxSelect" render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Selection</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                      placeholder="Unlimited"
                      data-testid={`input-item-maxselect${isEdit ? '-edit' : ''}`} 
                    />
                  </FormControl>
                  <FormDescription>Max quantity per order</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <FormField control={form.control} name="available" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Available</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-available${isEdit ? '-edit' : ''}`} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="suggested" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0 flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    Suggested
                  </FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-suggested${isEdit ? '-edit' : ''}`} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="isNew" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">New</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-new${isEdit ? '-edit' : ''}`} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4 pt-4">
            <FormField control={form.control} name="materials" render={({ field }) => (
              <FormItem>
                <FormLabel>Select Materials / Ingredients</FormLabel>
                <FormDescription>Choose the ingredients used in this dish</FormDescription>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center gap-3 p-3 rounded-md border hover-elevate cursor-pointer"
                      onClick={() => {
                        const current = field.value || [];
                        const newValue = current.includes(material.id)
                          ? current.filter((id) => id !== material.id)
                          : [...current, material.id];
                        field.onChange(newValue);
                      }}
                      data-testid={`checkbox-material-${material.id}${isEdit ? '-edit' : ''}`}
                    >
                      <Checkbox
                        checked={(field.value || []).includes(material.id)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          const newValue = checked
                            ? [...current, material.id]
                            : current.filter((id) => id !== material.id);
                          field.onChange(newValue);
                        }}
                      />
                      {material.image ? (
                        <img src={material.image} alt={material.name.en} className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: material.backgroundColor || '#999' }}
                        >
                          {material.name.en?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm">{material.name.en}</span>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          
          <TabsContent value="descriptions" className="space-y-4 pt-4">
            <FormField control={form.control} name="shortDescriptionEn" render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description (English)</FormLabel>
                <FormControl><Input {...field} placeholder="Brief description for menu cards" data-testid={`input-item-short-desc${isEdit ? '-edit' : ''}`} /></FormControl>
                <FormDescription>Shown on menu cards</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="longDescriptionEn" render={({ field }) => (
              <FormItem>
                <FormLabel>Long Description (English)</FormLabel>
                <FormControl><Textarea {...field} placeholder="Detailed description for item modal" data-testid={`input-item-long-desc${isEdit ? '-edit' : ''}`} /></FormControl>
                <FormDescription>Shown in detailed view</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          
          <TabsContent value="translations" className="space-y-4 pt-4 max-h-[300px] overflow-y-auto">
            <div className="space-y-3 p-3 rounded-md bg-muted/50">
              <h4 className="font-medium text-sm">Spanish (Español)</h4>
              <FormField control={form.control} name="nameEs" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Name</FormLabel>
                  <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-name-es${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="shortDescriptionEs" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Short Description</FormLabel>
                  <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-short-desc-es${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="longDescriptionEs" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Long Description</FormLabel>
                  <FormControl><Textarea {...field} value={typeof field.value === 'string' ? field.value : ''} rows={2} data-testid={`input-item-long-desc-es${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
            </div>
            <div className="space-y-3 p-3 rounded-md bg-muted/50">
              <h4 className="font-medium text-sm">French (Français)</h4>
              <FormField control={form.control} name="nameFr" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Name</FormLabel>
                  <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-name-fr${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="shortDescriptionFr" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Short Description</FormLabel>
                  <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-short-desc-fr${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
            </div>
            <div className="space-y-3 p-3 rounded-md bg-muted/50">
              <h4 className="font-medium text-sm">Farsi (فارسی)</h4>
              <FormField control={form.control} name="nameFa" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Name</FormLabel>
                  <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-name-fa${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="shortDescriptionFa" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Short Description</FormLabel>
                  <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-short-desc-fa${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
            </div>
            <div className="space-y-3 p-3 rounded-md bg-muted/50">
              <h4 className="font-medium text-sm">Turkish (Türkçe)</h4>
              <FormField control={form.control} name="nameTr" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Name</FormLabel>
                  <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-name-tr${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="shortDescriptionTr" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Short Description</FormLabel>
                  <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-short-desc-tr${isEdit ? '-edit' : ''}`} /></FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" data-testid={`button-${isEdit ? 'update' : 'save'}-item`} disabled={createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (itemsLoading || categoriesLoading) {
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
          <h1 className="text-2xl font-semibold">Menu Items</h1>
          <p className="text-muted-foreground">Manage your menu offerings</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-item" disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <DataTable
        data={items}
        columns={[
          { 
            key: 'image', 
            header: 'Image', 
            render: (item) => item.image ? (
              <img src={item.image} alt={item.name.en} className="w-10 h-10 rounded object-cover" />
            ) : (
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
            )
          },
          { key: 'name', header: 'Name', render: (item) => item.name.en },
          { key: 'categoryId', header: 'Category', render: (item) => getCategoryName(item.categoryId) },
          { 
            key: 'price', 
            header: 'Price', 
            render: (item) => (
              <div className="flex items-center gap-2">
                {item.discountedPrice ? (
                  <>
                    <span className="text-muted-foreground line-through">${item.price.toFixed(2)}</span>
                    <span className="text-green-600 font-medium">${item.discountedPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span>${item.price.toFixed(2)}</span>
                )}
              </div>
            )
          },
          {
            key: 'available',
            header: 'Status',
            render: (item) => (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={item.available ? 'default' : 'secondary'} className="no-default-active-elevate">
                  {item.available ? 'Available' : 'Unavailable'}
                </Badge>
                {item.suggested && (
                  <Badge variant="outline" className="no-default-active-elevate text-amber-600 border-amber-500/50">
                    <Star className="h-3 w-3 mr-1 fill-amber-500" />
                    Suggested
                  </Badge>
                )}
              </div>
            ),
          },
        ]}
        onEdit={openEdit}
        onDelete={(item) => setDeleteItem(item)}
        testIdPrefix="item"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="modal-menu-item-form">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <FormContent onSubmit={handleCreate} onCancel={() => setFormOpen(false)} isEdit={false} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="modal-menu-item-edit">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <FormContent onSubmit={handleEdit} onCancel={() => setEditingItem(null)} isEdit={true} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name.en}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-item" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
