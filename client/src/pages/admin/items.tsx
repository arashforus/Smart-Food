import { useState, useMemo } from 'react';
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
  generalName: z.string().min(1, 'Internal name is required'),
  name: z.record(z.string(), z.string().min(1, 'Name is required')),
  shortDescription: z.record(z.string(), z.string().min(1, 'Short description is required')),
  longDescription: z.record(z.string(), z.string().optional()),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  discountedPrice: z.number().optional(),
  maxSelect: z.number().optional(),
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
  image?: string;
  available: boolean;
  suggested: boolean;
  isNew: boolean;
  smokeEffect?: boolean;
  fireEffect?: boolean;
  iceEffect?: boolean;
  materials?: string[];
  types?: string[];
}

interface StorageCategory {
  id: string;
  name: Record<string, string>;
  image?: string;
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
}

export default function ItemsPage() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StorageItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<StorageItem | null>(null);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery<StorageItem[]>({
    queryKey: ['/api/items'],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<StorageCategory[]>({
    queryKey: ['/api/categories'],
  });

  // Watch for category change to update default image
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
      toast({ title: 'Menu Item Created' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create item', variant: 'destructive' });
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
    // Ensure all numeric fields are actual numbers
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
    // Ensure all numeric fields are actual numbers
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

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return 'Unknown';
    const nameData = cat.name;
    if (typeof nameData === 'string') return nameData;
    if (!nameData) return 'Unnamed';
    // Handle potential double nesting from migration or legacy data
    const directName = nameData.en || Object.values(nameData)[0];
    if (typeof directName === 'string') return directName;
    if (typeof directName === 'object' && directName !== null) {
      return (directName as any).en || Object.values(directName)[0] || 'Unnamed';
    }
    return 'Unnamed';
  };
  const currencySymbol = settings?.currencySymbol || '$';

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
            render: (item) => {
              const nameData = item.name;
              let itemName = 'Item';
              if (typeof nameData === 'string') {
                itemName = nameData;
              } else if (nameData) {
                const directName = nameData.en || Object.values(nameData)[0];
                if (typeof directName === 'string') {
                  itemName = directName;
                } else if (typeof directName === 'object' && directName !== null) {
                  itemName = (directName as any).en || Object.values(directName)[0] || 'Item';
                }
              }
              return (
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={itemName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image w-5 h-5 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                  )}
                </div>
              );
            }
          },
          { 
            key: 'generalName', 
            header: 'Name', 
            render: (item) => {
              const nameData = item.name;
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
              return item.generalName || displayName;
            }
          },
          { key: 'categoryId', header: 'Category', render: (item) => getCategoryName(item.categoryId) },
          { 
            key: 'price', 
            header: 'Price', 
            render: (item) => (
              <div className="flex items-center gap-2">
                {item.discountedPrice ? (
                  <>
                    <span className="text-muted-foreground line-through">{currencySymbol}{Number(item.price).toFixed(2)}</span>
                    <span className="text-green-600 font-medium">{currencySymbol}{Number(item.discountedPrice).toFixed(2)}</span>
                  </>
                ) : (
                  <span>{currencySymbol}{Number(item.price).toFixed(2)}</span>
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
                {item.isNew && (
                  <Badge variant="outline" className="no-default-active-elevate text-blue-600 border-blue-500/50">
                    New
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
          <FormContent 
            form={form}
            categories={categories}
            materials={materials}
            foodTypes={foodTypes}
            languages={languages}
            currencySymbol={currencySymbol}
            categoryImage={categoryImage}
            onSubmit={handleCreate} 
            onCancel={() => setFormOpen(false)} 
            isEdit={false}
            isPending={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="modal-menu-item-edit">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <FormContent 
            form={form}
            categories={categories}
            materials={materials}
            foodTypes={foodTypes}
            languages={languages}
            currencySymbol={currencySymbol}
            categoryImage={categoryImage}
            onSubmit={handleEdit} 
            onCancel={() => setEditingItem(null)} 
            isEdit={true}
            isPending={updateMutation.isPending}
          />
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

interface FormContentProps {
  form: any;
  categories: StorageCategory[];
  materials: StorageMaterial[];
  foodTypes: StorageFoodType[];
  languages: StorageLanguage[];
  currencySymbol: string;
  categoryImage?: string;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  isEdit: boolean;
  isPending: boolean;
}

function FormContent({
  form,
  categories,
  materials,
  foodTypes,
  languages,
  currencySymbol,
  categoryImage,
  onSubmit,
  onCancel,
  isEdit,
  isPending,
}: FormContentProps) {
  const { toast } = useToast();
  // Local state for materials to avoid immediate form update
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(form.getValues('materials') || []);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(form.getValues('types') || []);
  
  const onFormError = (errors: any) => {
    const errorMessages = Object.values(errors)
      .map((error: any) => error.message)
      .filter(Boolean);
    
    if (errorMessages.length > 0) {
      toast({
        title: "Validation Error",
        description: errorMessages.join(". "),
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = (data: ItemFormData) => {
    // Inject local material and type selections into the form data before submission
    onSubmit({ ...data, materials: selectedMaterials, types: selectedTypes });
  };

  const sortedLanguages = useMemo(() => {
    return [...languages].sort((a, b) => a.order - b.order);
  }, [languages]);

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit, onFormError)} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="translations">Translations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <FormField control={form.control} name="generalName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Internal Display)</FormLabel>
                  <FormControl><Input {...field} data-testid={`input-item-general-name${isEdit ? '-edit' : ''}`} /></FormControl>
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
                        placeholder={categoryImage || "Upload image or enter URL"}
                        testId={`input-item-image${isEdit ? '-edit' : ''}`}
                      />
                    </FormControl>
                    <div className="flex items-center mt-2 border rounded-md bg-muted/20 divide-x h-12">
                      <FormField
                        control={form.control}
                        name="smokeEffect"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                            <FormLabel className="text-xs font-medium">Smoke</FormLabel>
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
                            <FormLabel className="text-xs font-medium">Fire</FormLabel>
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
                            <FormLabel className="text-xs font-medium">Ice</FormLabel>
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
                    <FormLabel>Price ({currencySymbol})</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                        data-testid={`input-item-price${isEdit ? '-edit' : ''}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="discountedPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discounted Price ({currencySymbol})</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              
              <div className="flex items-center mt-4 border rounded-md bg-muted/20 divide-x h-12">
                <FormField control={form.control} name="available" render={({ field }) => (
                  <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                    <FormLabel className="text-xs font-medium">Available</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-available${isEdit ? '-edit' : ''}`} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="suggested" render={({ field }) => (
                  <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                    <FormLabel className="text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      Suggested
                    </FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-suggested${isEdit ? '-edit' : ''}`} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isNew" render={({ field }) => (
                  <FormItem className="flex-1 flex items-center justify-center gap-2 space-y-0 px-2 h-full">
                    <FormLabel className="text-xs font-medium">New</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-new${isEdit ? '-edit' : ''}`} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            </TabsContent>
            
            <TabsContent value="materials" className="space-y-4 pt-4">
              <FormItem>
                <FormLabel>Select Materials / Ingredients</FormLabel>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover-elevate transition-colors"
                      //onClick={() => {
                      //  setSelectedMaterials(current => 
                      //    current.includes(material.id)
                      //      ? current.filter(id => id !== material.id)
                      //      : [...current, material.id]
                       // );
                      //}}
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

            <TabsContent value="types" className="space-y-4 pt-4">
              <FormItem>
                <FormLabel>Select Food Types</FormLabel>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {foodTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover-elevate transition-colors"
                      //onClick={() => {
                      //  setSelectedTypes(current => 
                      //    current.includes(type.id)
                      //      ? current.filter(id => id !== type.id)
                      //      : [...current, type.id]
                      //  );
                      //}}
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
                      {type.icon ? (
                        <div className="w-6 h-6 rounded overflow-hidden flex items-center justify-center">
                          {type.icon.includes('/') || type.icon.includes('http') || type.icon.length > 10 ? (
                            <img src={type.icon} alt={type.name.en} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{type.icon}</span>
                          )}
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: type.color || '#999' }}
                        >
                          {type.name.en?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm">{type.name.en || Object.values(type.name)[0]}</span>
                    </div>
                  ))}
                </div>
              </FormItem>
            </TabsContent>
            
            <TabsContent value="translations" className="space-y-4 pt-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-6 pb-4">
                {sortedLanguages.filter(lang => lang.isActive).map((language) => {
                  const langCode = language.code.charAt(0).toUpperCase() + language.code.slice(1).toLowerCase();
                  const fieldName = `name${langCode}` as any;
                  const shortDescName = `shortDescription${langCode}` as any;
                  const longDescName = `longDescription${langCode}` as any;
                  
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
                        <FormLabel>Name ({language.name})</FormLabel>
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
                        <FormLabel>Short Description ({language.name})</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={typeof field.value === 'string' ? field.value : (typeof field.value === 'object' && field.value !== null ? ((field.value as any).en || Object.values(field.value)[0] || '') : '')} 
                            data-testid={`input-item-short-desc-${language.code}${isEdit ? '-edit' : ''}`} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name={`longDescription.${language.code}`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Long Description ({language.name})</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={typeof field.value === 'string' ? field.value : (typeof field.value === 'object' && field.value !== null ? ((field.value as any).en || Object.values(field.value)[0] || '') : '')} 
                            rows={3}
                            data-testid={`input-item-long-desc-${language.code}${isEdit ? '-edit' : ''}`} 
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
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" data-testid={`button-${isEdit ? 'update' : 'save'}-item`} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    );
}
