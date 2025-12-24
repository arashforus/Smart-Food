import { useState, useRef } from 'react';
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

export default function CategoriesPage() {
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
          nameObj[lang.code] = langName || (lang.code === 'en' ? (data as any).name : '');
        }
      });
      return apiRequest('POST', '/api/categories', {
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
      toast({ title: 'Category Created' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create category', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      if (!editingCategory) throw new Error('No category selected');
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        if (lang.isActive) {
          const langName = (data as any)[`name_${lang.code}`];
          nameObj[lang.code] = langName || (lang.code === 'en' ? (data as any).name : '');
        }
      });
      return apiRequest('PATCH', `/api/categories/${editingCategory.id}`, {
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
      toast({ title: 'Category Updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update category', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setDeleteCategory(null);
      toast({ title: 'Category Deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete category', variant: 'destructive' });
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
      name: category.name.en || '',
      image: category.image || '',
      order: category.order,
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
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground">Organize your menu items</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-category" disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <DataTable
        data={categories.sort((a, b) => a.order - b.order)}
        columns={[
          {
            key: 'image',
            header: 'Image',
            render: (item) => item.image ? (
              <img src={item.image} alt={item.name.en} className="w-10 h-10 rounded-md object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            ),
          },
          { key: 'name', header: 'Name (English)', render: (item) => item.name.en },
          { key: 'translations', header: 'Translations', render: (item) => {
            const count = Object.values(item.name).filter(v => v && v.length > 0).length;
            return `${count} language(s)`;
          }},
          { key: 'order', header: 'Order' },
        ]}
        onEdit={openEdit}
        onDelete={(item) => setDeleteCategory(item)}
        testIdPrefix="category"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="modal-category-form">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="translations">Translations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 pt-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Category name" data-testid="input-category-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optional)</FormLabel>
                      <FormControl><Input {...field} placeholder="https://..." data-testid="input-category-image" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="order" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} data-testid="input-category-order" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </TabsContent>
                
                <TabsContent value="translations" className="space-y-4 pt-4">
                  {languages.map((lang) => lang.isActive && (
                    <FormField key={lang.code} control={form.control} name={`name_${lang.code}`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name ({lang.name})</FormLabel>
                        <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-category-name-${lang.code}-trans`} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-category" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md" data-testid="modal-category-edit">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="translations">Translations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 pt-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} data-testid="input-category-name-edit" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {field.value && typeof field.value === 'string' && (
                            <div className="flex justify-center">
                              <img src={field.value} alt="Category preview" className="h-48 w-48 rounded-lg object-cover border" />
                            </div>
                          )}
                          <input type="file" ref={fileInputRefEdit} onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => field.onChange(event.target?.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} accept="image/*" className="hidden" data-testid="input-file-category-image-edit" />
                          <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRefEdit.current?.click()} data-testid="button-upload-image-edit">
                            <Upload className="w-4 h-4 mr-2" />
                            {field.value ? 'Change Image' : 'Upload Image'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="order" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} data-testid="input-category-order-edit" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="isActive" render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-category-active-edit" />
                      </FormControl>
                    </FormItem>
                  )} />
                </TabsContent>
                
                <TabsContent value="translations" className="space-y-4 pt-4">
                  {languages.map((lang) => lang.isActive && (
                    <FormField key={lang.code} control={form.control} name={`name_${lang.code}`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name ({lang.name})</FormLabel>
                        <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-category-name-${lang.code}-edit`} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setEditingCategory(null)}>Cancel</Button>
                <Button type="submit" data-testid="button-update-category" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteCategory?.name.en}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
