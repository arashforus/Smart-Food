import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MenuItem, Category } from '@/lib/types';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameEs: z.string().min(1, 'Spanish name is required'),
  nameFr: z.string().min(1, 'French name is required'),
  description: z.string().min(1, 'Description is required'),
  descriptionEs: z.string().min(1, 'Spanish description is required'),
  descriptionFr: z.string().min(1, 'French description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  maxSelect: z.number().min(1, 'Max selection must be at least 1').optional(),
  categoryId: z.string().min(1, 'Category is required'),
  available: z.boolean(),
  image: z.string().optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  item?: MenuItem | null;
  categories: Category[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MenuItemFormData) => void;
}

export default function MenuItemForm({ item, categories, open, onClose, onSubmit }: MenuItemFormProps) {
  // Use category image as default if item doesn't have one
  const getCategoryImage = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.image;
  };

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: (item?.name as any)?.en ?? '',
      nameEs: (item?.name as any)?.es ?? '',
      nameFr: (item?.name as any)?.fr ?? '',
      description: (item?.shortDescription as any)?.en ?? '',
      descriptionEs: (item?.shortDescription as any)?.es ?? '',
      descriptionFr: (item?.shortDescription as any)?.fr ?? '',
      price: Number(item?.price) || 0,
      maxSelect: Number(item?.maxSelect) || 1,
      categoryId: item?.categoryId ?? '',
      available: item?.available ?? true,
      image: item?.image ?? '',
    },
  });

  const handleSubmit = (data: MenuItemFormData) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="modal-menu-item-form">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl>
                    <Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid="input-item-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="nameEs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Spanish)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-item-name-es" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="nameFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (French)</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-item-name-fr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-item-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionEs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Spanish)</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-item-description-es" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (French)</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-item-description-fr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        data-testid="input-item-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxSelect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Selection</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-item-max-select"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                const categoryImage = getCategoryImage(form.watch('categoryId'));
                return (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <div className="flex flex-col gap-2">
                      <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                        {field.value ? (
                          <img src={field.value} alt="Preview" className="w-full h-full object-cover" />
                        ) : categoryImage ? (
                          <img src={categoryImage} alt="Category Default" className="w-full h-full object-cover opacity-50" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image w-8 h-8 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                        )}
                      </div>
                      <FormControl>
                        <Input {...field} value={typeof field.value === 'string' ? field.value : ''} placeholder="Image URL" data-testid="input-item-image" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-item">
                {item ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
