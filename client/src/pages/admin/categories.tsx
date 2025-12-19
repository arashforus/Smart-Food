import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, Upload } from 'lucide-react';
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
import { mockCategories, mockLanguages } from '@/lib/mockData';
import type { Category } from '@/lib/types';

const categorySchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameEs: z.string().optional(),
  nameFr: z.string().optional(),
  nameFa: z.string().optional(),
  nameTr: z.string().optional(),
  image: z.string().optional(),
  order: z.number().min(1, 'Order must be at least 1'),
  active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const activeLanguages = mockLanguages.filter((l) => l.isActive);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefEdit = useRef<HTMLInputElement>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '', image: '', order: 1, active: true },
  });

  const openCreate = () => {
    form.reset({ nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '', image: '', order: categories.length + 1, active: true });
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    form.reset({
      nameEn: category.name.en || '',
      nameEs: category.name.es || '',
      nameFr: category.name.fr || '',
      nameFa: category.name.fa || '',
      nameTr: category.name.tr || '',
      image: category.image || '',
      order: category.order,
      active: (category as any).active !== undefined ? (category as any).active : true,
    });
    setEditingCategory(category);
  };

  const handleCreate = (data: CategoryFormData) => {
    const newCategory: any = {
      id: String(Date.now()),
      name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
      image: data.image,
      order: data.order,
      active: data.active,
    };
    setCategories([...categories, newCategory]);
    setFormOpen(false);
    form.reset();
    toast({ title: 'Category Created' });
  };

  const handleEdit = (data: CategoryFormData) => {
    if (!editingCategory) return;
    setCategories(categories.map((c) => {
      if (c.id === editingCategory.id) {
        return {
          ...c,
          name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
          image: data.image,
          order: data.order,
          active: data.active,
        };
      }
      return c;
    }));
    setEditingCategory(null);
    form.reset();
    toast({ title: 'Category Updated' });
  };

  const handleDelete = () => {
    if (!deleteCategory) return;
    setCategories(categories.filter((c) => c.id !== deleteCategory.id));
    setDeleteCategory(null);
    toast({ title: 'Category Deleted' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground">Organize your menu items</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-category">
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
              <FormField control={form.control} name="nameEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl><Input {...field} data-testid="input-category-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {activeLanguages.filter(l => l.code !== 'en').map((lang) => (
                <FormField key={lang.code} control={form.control} name={`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof CategoryFormData} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name ({lang.name})</FormLabel>
                    <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-category-name-${lang.code}`} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
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
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-category">Create</Button>
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
                  <FormField control={form.control} name="nameEn" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (English)</FormLabel>
                      <FormControl><Input {...field} data-testid="input-category-name-edit" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
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
                            Upload Image
                          </Button>
                          {field.value && typeof field.value === 'string' && (
                            <img src={field.value} alt="Category preview" className="h-16 w-16 rounded object-cover" />
                          )}
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
                  
                  <FormField control={form.control} name="active" render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-category-active-edit" />
                      </FormControl>
                    </FormItem>
                  )} />
                </TabsContent>
                
                <TabsContent value="translations" className="space-y-4 pt-4">
                  {activeLanguages.filter(l => l.code !== 'en').map((lang) => (
                    <FormField key={lang.code} control={form.control} name={`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof CategoryFormData} render={({ field }) => (
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
                <Button type="submit" data-testid="button-update-category">Update</Button>
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
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
