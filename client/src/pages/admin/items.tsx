import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '@/components/admin/DataTable';
import { useToast } from '@/hooks/use-toast';
import { mockMenuItems, mockCategories, mockLanguages } from '@/lib/mockData';
import type { MenuItem } from '@/lib/types';

const itemSchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameEs: z.string().optional(),
  nameFr: z.string().optional(),
  nameFa: z.string().optional(),
  nameTr: z.string().optional(),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionEs: z.string().optional(),
  descriptionFr: z.string().optional(),
  descriptionFa: z.string().optional(),
  descriptionTr: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
  available: z.boolean(),
});

type ItemFormData = z.infer<typeof itemSchema>;

export default function ItemsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const categories = mockCategories;
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const activeLanguages = mockLanguages.filter((l) => l.isActive);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '',
      descriptionEn: '', descriptionEs: '', descriptionFr: '', descriptionFa: '', descriptionTr: '',
      price: 0, categoryId: '', image: '', available: true
    },
  });

  const openCreate = () => {
    form.reset({
      nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '',
      descriptionEn: '', descriptionEs: '', descriptionFr: '', descriptionFa: '', descriptionTr: '',
      price: 0, categoryId: categories[0]?.id || '', image: '', available: true
    });
    setFormOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    form.reset({
      nameEn: item.name.en || '',
      nameEs: item.name.es || '',
      nameFr: item.name.fr || '',
      nameFa: item.name.fa || '',
      nameTr: item.name.tr || '',
      descriptionEn: item.description.en || '',
      descriptionEs: item.description.es || '',
      descriptionFr: item.description.fr || '',
      descriptionFa: item.description.fa || '',
      descriptionTr: item.description.tr || '',
      price: item.price,
      categoryId: item.categoryId,
      image: item.image || '',
      available: item.available,
    });
    setEditingItem(item);
  };

  const handleCreate = (data: ItemFormData) => {
    const newItem: MenuItem = {
      id: String(Date.now()),
      name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
      description: { en: data.descriptionEn, es: data.descriptionEs || '', fr: data.descriptionFr || '', fa: data.descriptionFa || '', tr: data.descriptionTr || '' },
      price: data.price,
      categoryId: data.categoryId,
      image: data.image,
      available: data.available,
      materials: [],
      types: [],
    };
    setItems([...items, newItem]);
    setFormOpen(false);
    form.reset();
    toast({ title: 'Menu Item Created' });
  };

  const handleEdit = (data: ItemFormData) => {
    if (!editingItem) return;
    setItems(items.map((i) => {
      if (i.id === editingItem.id) {
        return {
          ...i,
          name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
          description: { en: data.descriptionEn, es: data.descriptionEs || '', fr: data.descriptionFr || '', fa: data.descriptionFa || '', tr: data.descriptionTr || '' },
          price: data.price,
          categoryId: data.categoryId,
          image: data.image,
          available: data.available,
        };
      }
      return i;
    }));
    setEditingItem(null);
    form.reset();
    toast({ title: 'Menu Item Updated' });
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setItems(items.filter((i) => i.id !== deleteItem.id));
    setDeleteItem(null);
    toast({ title: 'Menu Item Deleted' });
  };

  const getCategoryName = (categoryId: string) => categories.find((c) => c.id === categoryId)?.name.en || 'Unknown';

  const FormContent = ({ onSubmit, onCancel, isEdit }: { onSubmit: (data: ItemFormData) => void; onCancel: () => void; isEdit: boolean }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nameEn" render={({ field }) => (
          <FormItem>
            <FormLabel>Name (English)</FormLabel>
            <FormControl><Input {...field} data-testid={`input-item-name${isEdit ? '-edit' : ''}`} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {activeLanguages.filter(l => l.code !== 'en').map((lang) => (
          <FormField key={`name-${lang.code}`} control={form.control} name={`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof ItemFormData} render={({ field }) => (
            <FormItem>
              <FormLabel>Name ({lang.name})</FormLabel>
              <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-name-${lang.code}${isEdit ? '-edit' : ''}`} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        ))}
        <FormField control={form.control} name="descriptionEn" render={({ field }) => (
          <FormItem>
            <FormLabel>Description (English)</FormLabel>
            <FormControl><Textarea {...field} data-testid={`input-item-description${isEdit ? '-edit' : ''}`} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {activeLanguages.filter(l => l.code !== 'en').map((lang) => (
          <FormField key={`desc-${lang.code}`} control={form.control} name={`description${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof ItemFormData} render={({ field }) => (
            <FormItem>
              <FormLabel>Description ({lang.name})</FormLabel>
              <FormControl><Textarea {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid={`input-item-description-${lang.code}${isEdit ? '-edit' : ''}`} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        ))}
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
        </div>
        <FormField control={form.control} name="image" render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL (optional)</FormLabel>
            <FormControl><Input {...field} placeholder="https://..." data-testid={`input-item-image${isEdit ? '-edit' : ''}`} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="available" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormLabel className="mt-0">Available</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-item-available${isEdit ? '-edit' : ''}`} />
            </FormControl>
          </FormItem>
        )} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" data-testid={`button-${isEdit ? 'update' : 'save'}-item`}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Menu Items</h1>
          <p className="text-muted-foreground">Manage your menu offerings</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-item">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <DataTable
        data={items}
        columns={[
          { key: 'name', header: 'Name', render: (item) => item.name.en },
          { key: 'categoryId', header: 'Category', render: (item) => getCategoryName(item.categoryId) },
          { key: 'price', header: 'Price', render: (item) => `$${item.price.toFixed(2)}` },
          {
            key: 'available',
            header: 'Status',
            render: (item) => (
              <Badge variant={item.available ? 'default' : 'secondary'} className="no-default-active-elevate">
                {item.available ? 'Available' : 'Unavailable'}
              </Badge>
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
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-item">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
